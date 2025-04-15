import { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

const AnnotationWrapper = ({ 
  id, 
  x, 
  y, 
  width, 
  height, 
  onDrag, 
  onResize, 
  onDelete, 
  children,
  minWidth = 50,
  minHeight = 30,
  defaultActive = false
}) => {
  const [size, setSize] = useState({ width, height });
  const [active, setActive] = useState(defaultActive);
  const nodeRef = useRef(null);

  // Update internal state when props change
  useEffect(() => {
    setSize({ width, height });
  }, [width, height]);

  const handleDrag = (e, data) => {
    onDrag(id, data.x, data.y);
  };

  const handleResize = (e, { size }) => {
    setSize(size);
    onResize(id, size.width, size.height);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={{ x, y }}
      position={null} // Controlled position
      onStop={handleDrag}
      onStart={() => setActive(true)}
   //   onStop={() => setActive(false)}
    >
      <div 
        ref={nodeRef}
        className="absolute z-10"
        style={{
          outline: active ? '2px dashed #3182ce' : 'none'
        }}
      >
        <Resizable
          width={size.width}
          height={size.height}
          minConstraints={[minWidth, minHeight]}
          onResize={handleResize}
        >
          <div 
            style={{ 
              width: size.width + 'px', 
              height: size.height + 'px',
              position: 'relative',
              cursor: 'move'
            }}
          >
            {children}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 z-20"
            >
              ×
            </button>
          </div>
        </Resizable>
      </div>
    </Draggable>
  );
};

export default AnnotationWrapper;