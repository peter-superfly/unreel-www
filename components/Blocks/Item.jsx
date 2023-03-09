import { useMotionValue, Reorder, useDragControls } from "framer-motion";
import { useRaisedShadow } from "./use-raised-shadow";
import { ReorderIcon } from "./Icon";
import ImageBlock from "./Image";

export const Item = ({ item, block, editable }) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const dragControls = useDragControls();

  let block_type = block["type"];
  switch (block_type) {
    case 1:
      return (
        <Reorder.Item
          className={"text-block"}
          value={item}
          id={item}
          style={{ boxShadow, y }}
          dragListener={false}
          dragControls={dragControls}
        >
          <ReorderIcon dragControls={dragControls} />
          <span className={"body-text"}>{block.text}</span>
        </Reorder.Item>
      );
    case 5:
      return (
        <Reorder.Item
          className={"text-block"}
          value={item}
          id={item}
          style={{ boxShadow, y }}
          dragListener={false}
          dragControls={dragControls}
        >
          <ReorderIcon dragControls={dragControls} />
          <ImageBlock editable={editable} image_url={block["image_url"]} />
        </Reorder.Item>
      );
    default:
      return (
        <Reorder.Item
          value={item}
          id={item}
          style={{ boxShadow, y }}
          dragListener={false}
          dragControls={dragControls}
        >
          <ReorderIcon dragControls={dragControls} />
          <span>{"item"}</span>
        </Reorder.Item>
      );
  }
};
