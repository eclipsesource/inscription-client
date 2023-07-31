import './ScriptArea.css';
import { Browser, useBrowser } from '../../../components/browser';
import ResizableCodeEditor, { CodeEditorAreaProps } from './ResizableCodeEditor';
import { monacoAutoFocus, useCodeEditorOnFocus, useModifyEditor } from './useCodeEditor';
import { usePath } from '../../../context';
import { CardArea } from '../output/CardText';
import { ElementRef, useRef } from 'react';

const MacroArea = (props: CodeEditorAreaProps) => {
  const { isFocusWithin, focusWithinProps } = useCodeEditorOnFocus();
  const browser = useBrowser();
  const { setEditor, modifyEditor } = useModifyEditor();
  const path = usePath();
  const areaRef = useRef<ElementRef<'output'>>(null);

  return (
    // tabIndex is needed for safari to catch the focus when click on browser button
    <div className='script-area' {...focusWithinProps} tabIndex={1}>
      {isFocusWithin || browser.open ? (
        <>
          <ResizableCodeEditor
            {...props}
            location={path}
            onMountFuncs={[setEditor, monacoAutoFocus]}
            macro={true}
            initHeight={areaRef.current?.offsetHeight}
          />
          <Browser {...browser} types={['attr', 'cms']} accept={value => modifyEditor(`<%=${value}%>`)} location={path} />
        </>
      ) : (
        <CardArea {...props} ref={areaRef} />
      )}
    </div>
  );
};

export default MacroArea;
