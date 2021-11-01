import "./slider.scss";

export default function Slider(options) {
    const {elem} = options;
    const thumbElem = elem.querySelector(".thumb");
    let shiftX = 0;
    const sliderCoords = elem.getBoundingClientRect();

    function moveTo(x) {
        let newLeft = x - shiftX - sliderCoords.left;
        if (newLeft < 0) {
            newLeft = 0;
        }
        const rightEdge = elem.offsetWidth - thumbElem.offsetWidth;
        if (newLeft > rightEdge) {
            newLeft = rightEdge;
        }
        thumbElem.style.left = `${newLeft}px`;
    }

    function onDocumentPointerMove(e) {
        moveTo(e.clientX);
    }

    function onDocumentPointerUp() {
        endDrag();
    }

    function endDrag() {
        document.removeEventListener("pointermove", onDocumentPointerMove);
        document.removeEventListener("pointerup", onDocumentPointerUp);
    }


    function startDrag(x) {
        const thumbCoords = thumbElem.getBoundingClientRect();
        shiftX = x - thumbCoords.left;
        document.addEventListener("pointermove", onDocumentPointerMove);
        document.addEventListener("pointerup", onDocumentPointerUp);
    }

    elem.addEventListener("dragstart", e => e.preventDefault());
    elem.addEventListener("pointerdown", e => {
        const slide = e.target.closest(".thumb");
        if (slide) {
            startDrag(e.clientX);
            return false;
        }
        thumbElem.style.left = `${e.clientX - sliderCoords.left - thumbElem.clientWidth / 2}px`;
        startDrag(e.clientX);
        return true;
    });

    function getPosition() {
        return (thumbElem.offsetLeft - elem.offsetLeft) * 100 / elem.clientWidth;
    }

    this.getPosition = getPosition;
}