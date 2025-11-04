interface Action {
  _id: string;
  action: string;
  readOnly?: boolean;
}
interface Permission {
  feature: string;
  actions: Action[];
  isAllowed?: boolean;
}

const featureDependencies: Record<string, string[]> = {
  Leads: ["Users"],
  Deals: ["Users"],
  Flows: ["Leads"],
  Tasks: ["Leads", "Users"],
  Lists: ["Leads", "Companies"],
  Contacts: ["Companies"],
};

const actionDependencies: Record<
  string,
  Record<string, { feature: string; actions: string[] }[]>
> = {
  Flows: {
    "CONVERT TO TASK": [{ feature: "Tasks", actions: ["READ", "CREATE"] }],
  },
};

export const getReadIdByFeature = (
  feature: string,
  permissions: Permission[]
): string | undefined => {
  return permissions
    .find((p) => p.feature === feature)
    ?.actions.find((a) => a.action === "READ")?._id;
};

export const getActionIdByFeatureAndAction = (
  feature: string,
  action: string,
  permissions: Permission[]
): string | undefined => {
  return permissions
    .find((p) => p.feature === feature)
    ?.actions.find((a) => a.action === action)?._id;
};

export const getActionDependencies = (
  action: Action,
  feature: string,
  permissions: Permission[]
): string[] => {
  const featureActions = actionDependencies[feature];
  if (!featureActions) return [];

  const dependencies = featureActions[action.action] || [];
  const dependencyIds: string[] = [];

  for (const dep of dependencies) {
    for (const requiredAction of dep.actions) {
      const actionId = getActionIdByFeatureAndAction(
        dep.feature,
        requiredAction,
        permissions
      );
      if (actionId) {
        dependencyIds.push(actionId);
      }
    }
  }

  return dependencyIds;
};

export const resolveFeatureFromId = (
  actionId: string,
  permissions: Permission[]
): [string, Action | undefined] => {
  for (const perm of permissions) {
    const match = perm.actions.find((a) => a._id === actionId);
    if (match) return [perm.feature, match];
  }
  return ["", undefined];
};

export const handleToggleAll = ({
  permissions,
  selectedPermissions,
  setSelectedPermissions,
}: {
  permissions: Permission[];
  selectedPermissions: string[];
  setSelectedPermissions: (ids: string[]) => void;
}) => {
  const allIds = permissions
    .filter((p) => p.isAllowed !== false)
    .flatMap((p) => p.actions.filter((a) => !a.readOnly).map((a) => a._id));
  const allChecked = allIds.every((id) => selectedPermissions.includes(id));
  const newIds = allChecked
    ? selectedPermissions.filter((id) => !allIds.includes(id))
    : [...new Set([...selectedPermissions, ...allIds])];

  setSelectedPermissions(applyDependencyLogic(newIds, permissions));
};

export const filterPermissions = (
  permissions: Permission[],
  search: string
): Permission[] => {
  return permissions.filter((p) =>
    p.feature.toLowerCase().includes(search.toLowerCase())
  );
};

export const toggleFeatureActions = ({
  permission,
  selectedPermissions,
  permissions,
}: {
  permission: Permission;
  selectedPermissions: string[];
  permissions: Permission[];
}): string[] => {
  if (permission.isAllowed === false) return selectedPermissions;

  const allChecked = permission.actions.every((a) =>
    selectedPermissions.includes(a._id)
  );
  const updated = allChecked
    ? selectedPermissions.filter((id) =>
        permission.actions.every((a) => a._id !== id)
      )
    : [
        ...new Set([
          ...selectedPermissions,
          ...permission.actions.map((a) => a._id),
        ]),
      ];

  return applyDependencyLogic(updated, permissions);
};

export const toggleActionById = ({
  actionId,
  permission,
  selectedPermissions,
  permissions,
}: {
  actionId: string;
  permission: Permission;
  selectedPermissions: string[];
  permissions: Permission[];
}): string[] => {
  if (permission.isAllowed === false) return selectedPermissions;

  const isChecked = selectedPermissions.includes(actionId);
  const action = permission.actions.find((a) => a._id === actionId);
  const read = permission.actions.find((a) => a.action === "READ");

  let updated = [...selectedPermissions];

  if (isChecked) {
    // Check if any other actions depend on this action before removing it
    const isDependedUpon = permissions.some((p) =>
      p.actions.some((a) => {
        const deps = getActionDependencies(a, p.feature, permissions);
        return deps.includes(actionId) && updated.includes(a._id);
      })
    );

    if (isDependedUpon) {
      // Don't remove if other selected actions depend on this
      return updated;
    }

    if (action?.action === "READ") {
      const othersChecked = permission.actions.some(
        (a) => a._id !== actionId && updated.includes(a._id)
      );
      if (!othersChecked) {
        updated = updated.filter((id) => id !== actionId);
      }
    } else {
      updated = updated.filter((id) => id !== actionId);
    }
  } else {
    updated.push(actionId);
    if (action?.action !== "READ" && read && !updated.includes(read._id)) {
      updated.push(read._id);
    }
  }

  return applyDependencyLogic([...new Set(updated)], permissions);
};

export const applyDependencyLogic = (
  ids: string[],
  permissions: Permission[]
): string[] => {
  const result = new Set(ids);

  const visited = new Set<string>();

  const resolve = (feature: string) => {
    if (visited.has(feature)) return;
    visited.add(feature);

    const required = featureDependencies[feature] || [];
    for (const dep of required) {
      const readId = getReadIdByFeature(dep, permissions);
      if (readId) result.add(readId);
      resolve(dep); // recursively resolve further dependencies
    }
  };

  for (const id of ids) {
    const [feature, action] = resolveFeatureFromId(id, permissions);
    if (feature) resolve(feature);

    // Handle action dependencies
    if (action) {
      const actionDeps = getActionDependencies(action, feature, permissions);
      for (const depId of actionDeps) {
        result.add(depId);
        // Also resolve feature dependencies for the dependent action
        const [depFeature] = resolveFeatureFromId(depId, permissions);
        if (depFeature) resolve(depFeature);
      }
    }
  }

  return [...result];
};

export const isReadDisabledByDependency = (
  feature: string,
  selected: string[],
  permissions: Permission[]
): boolean => {
  const readId = getReadIdByFeature(feature, permissions);
  if (!readId) return false;

  return Object.entries(featureDependencies).some(
    ([dependent, required]) =>
      required.includes(feature) &&
      selected.some((id) => {
        const [selectedFeature] = resolveFeatureFromId(id, permissions);
        return selectedFeature === dependent;
      })
  );
};
