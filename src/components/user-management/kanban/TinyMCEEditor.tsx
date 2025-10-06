import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import TextArea from "@/components/form/input/TextArea";

interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  readOnly?: boolean;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
  value,
  onChange,
  height = 400,
  readOnly = false,
}) => {
  if (readOnly) {
    return (
      <TextArea
        value={value}
        readOnly={true}
        rows={Math.max(3, Math.floor(height / 20))}
        className="bg-gray-50 border border-gray-200 rounded-lg p-4"
      />
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden">
      <Editor
        apiKey="9vfylg0c69saody88oap84blwbuwolf6sginfa1mkqbv3fw6"
        value={value}
        onEditorChange={(content) => onChange(content)}
        init={{
          height,
          menubar: false,
          highlight_on_focus: false,  
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
            "emoticons",
            "quickbars",
          ],
          toolbar:
            "undo redo | blocks fontfamily fontsize | " +
            "bold italic underline forecolor backcolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "link image table emoticons | removeformat code help",
          toolbar_mode: "sliding",
          quickbars_selection_toolbar:
            "bold italic | quicklink h2 h3 blockquote",
          quickbars_insert_toolbar: false,
          font_family_formats:
            "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva;",
          font_size_formats: "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt",
          content_style: `
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-size: 16px; 
              line-height: 1.6; 
              color: #374151;
              margin: 16px;
            }
            h1, h2, h3, h4, h5, h6 {
              font-weight: 600;
              margin-top: 1.5em;
              margin-bottom: 0.5em;
              color: #111827;
            }
            h1 { font-size: 2em; }
            h2 { font-size: 1.5em; }
            h3 { font-size: 1.25em; }
            p { margin-bottom: 1em; }
            ul, ol { padding-left: 1.5em; }
            blockquote {
              border-left: 4px solid #3b82f6;
              background-color: #f8fafc;
              padding: 1em 1.5em;
              margin: 1.5em 0;
              font-style: italic;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 1em 0;
            }
            table, th, td {
              border: 1px solid #e5e7eb;
            }
            th, td {
              padding: 0.75em;
              text-align: left;
            }
            th {
              background-color: #f9fafb;
              font-weight: 600;
            }
            code {
              background-color: #f3f4f6;
              padding: 0.2em 0.4em;
              border-radius: 0.25em;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
              font-size: 0.9em;
            }
            pre {
              background-color: #1f2937;
              color: #f9fafb;
              padding: 1em;
              border-radius: 0.5em;
              overflow-x: auto;
              margin: 1.5em 0;
            }
            pre code {
              background: none;
              padding: 0;
              color: inherit;
            }
          `,
          skin: "oxide",
          content_css: "default",
          branding: false,
          statusbar: true,
          resize: true,
          promotion: false,
          paste_data_images: true,
          images_upload_url: "your-image-upload-endpoint",
          automatic_uploads: true,
          image_caption: true,
          image_advtab: true,
          link_assume_external_targets: true,
          link_title: false,
          default_link_target: "_blank",
          placeholder: "Start writing your content here...",
        }}
      />
    </div>
  );
};

export default TinyMCEEditor;
