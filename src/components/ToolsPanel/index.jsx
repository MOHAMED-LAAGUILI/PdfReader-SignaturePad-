import SignatureTool from './SignatureTool';
import StampTool from './StampTool';
import TextTool from './TextTool';
import ActionsTool from './ActionsTool';

// Compose the main ToolsPanel component
function ToolsPanel(props) {
  // You can customize this layout as needed
  return (
    <div>
      <SignatureTool onAddSignature={props.onAddSignature} />
      <StampTool onAddStamp={props.onAddStamp} />
      <TextTool onAddText={props.onAddText} />
      <ActionsTool
        onGeneratePdf={props.onGeneratePdf}
        onExportJson={props.onExportJson}
        onSaveToServer={props.onSaveToServer}
        onClearAll={props.onClearAll}
        isLoading={props.isLoading}
        error={props.error}
        success={props.success}
      />
    </div>
  );
}

export { SignatureTool, StampTool, TextTool, ActionsTool, ToolsPanel };