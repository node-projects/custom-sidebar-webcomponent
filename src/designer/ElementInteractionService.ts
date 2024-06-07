import { IDesignerCanvas, IElementInteractionService } from "@node-projects/web-component-designer";
import { CustomSidebarWebcomponent } from "../sidebar/CustomSidebarWebcomponent.js";

export default class ElementInteractionService implements IElementInteractionService {
    stopEventHandling(designerCanvas: IDesignerCanvas, event: PointerEvent, currentElement: Element) {
        if (event.type !== 'pointerdown')
            return false;

        if (currentElement instanceof CustomSidebarWebcomponent) {
            let ctls = currentElement.shadowRoot.elementsFromPoint(event.x, event.y);
            //@ts-ignore
            ctls[1].click();
        }

        return false;
    }
}