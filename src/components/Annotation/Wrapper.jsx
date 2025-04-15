import { Rotate3d, X } from 'lucide-react';
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
  const nodeRef = useRef(null);

  useEffect(() => {
    setRotation(rotation);
  }, [rotation]);

  const handleDrag = (e, data) => {
    onDrag(id, data.x, data.y);
  };

  const handleResize = (e, { size }) => {
    onResize(id, size.width, size.height);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x, y }}
      bounds="parent"
      onStart={() => setActive(true)}
      onStop={handleDrag}
      disabled={isResizing}
    >
      <div
        ref={nodeRef}
        className={`absolute z-20 group transition-all duration-200 ${active ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:ring-2 hover:ring-blue-300 hover:shadow-md'}`}
        style={{
          outline: active ? '2px dashed #3182ce' : 'none',
          borderRadius: '8px',
        }}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        <Resizable
          width={width}
          height={height}
          minConstraints={[minWidth, minHeight]}
          onResizeStart={() => setIsResizing(true)}
          onResizeStop={(e, data) => { setIsResizing(false); handleResize(e, data); }}
        >
          <div
            style={{
              width: width + 'px',
              height: height + 'px',
              border: '2px solid red', 
              background: 'rgba(255,255,255,0.7)',
              position: 'relative',
              boxSizing: 'border-box',
              overflow: 'visible',
              borderRadius: '8px',
              transition: 'background 0.2s',
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                setRotation((r) => (r + 15) % 360);
                if (onRotate) onRotate(id, (rotationState + 15) % 360);
              }}
              className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-yellow-500 z-50 shadow tooltip"
              title="Rotate annotation"
              tabIndex={0}
              style={{ cursor: 'pointer', top: '-28px', zIndex: 50 }}
            >
             <Rotate3d/>
             </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 z-50 shadow tooltip"
              title="Delete annotation"
              tabIndex={0}
              style={{ zIndex: 50 }}
            >
             <X/>
            </button>
          </div>
        </Resizable>
      </div>
    </Draggable>
  );
};

