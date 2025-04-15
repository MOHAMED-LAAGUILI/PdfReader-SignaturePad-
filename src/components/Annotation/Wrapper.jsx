import { Rotate3d, Trash2, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

export default function AnnotationWrapper({ 
  id, 
  x, 
  y, 
  width, 
  height, 
  onDrag, 
  onResize, 
  onDelete, 
  onRotate,
  children,
  rotation = 0,
  minWidth = 50,
  minHeight = 30,
  defaultActive = false
}) {
  const [active, setActive] = useState(defaultActive);
  const [isResizing, setIsResizing] = useState(false);
  const [rotationState, setRotation] = useState(rotation);
  const [position, setPosition] = useState({ x, y });
  const [size, setSize] = useState({ width, height });
  const nodeRef = useRef(null);

  useEffect(() => {
    setRotation(rotation);
  }, [rotation]);

  useEffect(() => {
    setPosition({ x, y });
  }, [x, y]);

  useEffect(() => {
    setSize({ width, height });
  }, [width, height]);

  const handleDrag = (e, data) => {
    if (!isResizing) {
      const newPos = { x: data.x, y: data.y };
      setPosition(newPos);
      onDrag(id, data.x, data.y);
    }
  };

  const handleResizeStart = () => {
    setIsResizing(true);
    setActive(true);
  };

  const handleResize = (e, { size: newSize }) => {
    setSize(newSize);
    onResize(id, newSize.width, newSize.height);
  };

  const handleResizeStop = () => {
    setIsResizing(false);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      bounds="parent"
      onStart={() => {
        if (!isResizing) {
          setActive(true);
          return true;
        }
        return false;
      }}
      onDrag={handleDrag}
      onStop={handleDrag}
      cancel=".react-resizable-handle"
    >
      <div
        ref={nodeRef}
        className={`absolute z-20 group ${active ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:ring-2 hover:ring-blue-300 hover:shadow-md'}`}
        style={{
          outline: active ? '2px dashed #3182ce' : 'none',
          borderRadius: '8px',
          cursor: isResizing ? 'se-resize' : 'move',
        }}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => !isResizing && setActive(false)}
      >
        <Resizable
          width={size.width}
          height={size.height}
          minConstraints={[minWidth, minHeight]}
          onResizeStart={handleResizeStart}
          onResize={handleResize}
          onResizeStop={handleResizeStop}
          draggableOpts={{ grid: [1, 1] }}
        >
          <div
            style={{
              width: size.width + 'px',
              height: size.height + 'px',
              border: active ? '2px solid #3182ce' : '2px solid #e2e8f0',
              background: 'rgba(255,255,255,0.9)',
              position: 'relative',
              boxSizing: 'border-box',
              overflow: 'visible',
              borderRadius: '8px',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `rotate(${rotationState}deg)`
              }}
            >
              {children}
            </div>
            {active && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRotation((r) => (r + 15) % 360);
                    if (onRotate) onRotate(id, (rotationState + 15) % 360);
                  }}
                  className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-yellow-500 z-50 shadow"
                  title="Rotate annotation"
                  tabIndex={0}
                  style={{ cursor: 'pointer', top: '-28px' }}
                >
                  <Rotate3d size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(id);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 z-50 shadow"
                  title="Delete annotation"
                  tabIndex={0}
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
            <div 
              className="react-resizable-handle react-resizable-handle-se absolute w-4 h-4 bg-blue-500 rounded-full cursor-se-resize"
              style={{ 
                bottom: -6, 
                right: -6, 
                zIndex: 40,
                border: '2px solid white'
              }}
            />
          </div>
        </Resizable>
      </div>
    </Draggable>
  );
};
