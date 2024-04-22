import React from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const getInitialState = (defaultValue) => {
  if (defaultValue) {
    const blocksFromHtml = htmlToDraft(defaultValue);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    );
    return EditorState.createWithContent(contentState);
  } else {
    return EditorState.createEmpty();
  }
};

export const WYSIWYGEditor = ({ onChange = () => {}, defaultValue = "" }) => {
  const [editorState, setEditorState] = React.useState();
  const [defaultValueState, setdefaultValueState] = React.useState();

  React.useEffect(() => {
    if (defaultValue) {
      const initialState = getInitialState(defaultValue);
      onEditorDefaultStateChange(initialState);
    }
  }, [onEditorDefaultStateChange, defaultValue]);

  const onEditorDefaultStateChange = React.useCallback(
    (editorState) => {
      setdefaultValueState(editorState);
      return onChange(
        draftToHtml(convertToRaw(editorState.getCurrentContent()))
      );
    },
    [onChange]
  );

  const onEditorStateChange = React.useCallback(
    (editorState) => {
      setEditorState(editorState);
      return onChange(
        draftToHtml(convertToRaw(editorState.getCurrentContent()))
      );
    },
    [onChange]
  );

  return (
    <React.Fragment>
      <div className="editor">
        <Editor
          editorState={editorState ? editorState : defaultValueState}
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
          onEditorStateChange={onEditorStateChange}
        />
      </div>
    </React.Fragment>
  );
};
