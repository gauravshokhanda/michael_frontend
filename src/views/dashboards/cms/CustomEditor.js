// components/custom-editor.js
'use client' // only in App Router

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'; // Using the ClassicEditor build


function CustomEditor() {
    return (
        <CKEditor
            editor={ClassicEditor}
            config={{
                toolbar: {
                    items: ['undo', 'redo', '|', 'bold', 'italic'],
                },
                plugins: [Bold, Essentials, Italic, Paragraph, Undo], // Only free plugins
                initialData: '<p>Hello from CKEditor 5 in React!</p>', // Initial content
            }}
        />
    );
}

export default CustomEditor;
