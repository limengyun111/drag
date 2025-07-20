class DraggableEle {
	constructor(id) {
		this.id = id;
		this.ele = document.getElementById(this.id);

	}
	static beginMoveInfo = {
		isBeginMove: false,
		mouseBeginPos: undefined,
		dragEleBeginPos: undefined
	}

	getDragElePos = () => {
		const eleRect = this.ele.getBoundingClientRect();
		return {
			x: eleRect.width + eleRect.left,
			y: eleRect.height + eleRect.top,
			left: eleRect.left,
			top: eleRect.top
		}
	};
	isMouseInRange = (mousePos) => {
		const elePos = this.getDragElePos();
		return mousePos.x - elePos.left > 0 && mousePos.y - elePos.top && elePos.x - mousePos.x > 0 && elePos.y - mousePos.y > 0;
	};

	#setMoveBeginVal = (posX, posY) => {
		const elePos = this.getDragElePos();
		this.beginMoveInfo = {
			isBeginMove: true,
			mouseBeginPos: {
				x: posX,
				y: posY,
			},
			dragEleBeginPos: {
				x: elePos.left,
				y: elePos.top
			}

		}
	}
	#setDragElePos = (curX, curY) => {
		this.ele.style.left = this.beginMoveInfo.dragEleBeginPos.x + curX - this.beginMoveInfo.mouseBeginPos.x + 'px';
		this.ele.style.top = this.beginMoveInfo.dragEleBeginPos.y + curY - this.beginMoveInfo.mouseBeginPos.y + 'px';
	}

	draggable = () => {
		this.ele.addEventListener('touchstart', (event) => {
			const touch = event.touches[0];
			if (this.isMouseInRange({ x: touch.clientX, y: touch.clientY })) {
				this.#setMoveBeginVal(touch.clientX, touch.clientY);
			}
		});
		this.ele.addEventListener('mousedown', (event) => {
			if (this.isMouseInRange(event)) {
				this.#setMoveBeginVal(event.x, event.y);
			}
		});
		document.addEventListener('mousemove', (event) => {
			if (this.isMouseInRange(event)) {
				this.ele.style.cursor = 'move';
			} else {
				this.ele.style.cursor = 'pointer'
			};

			if (this.beginMoveInfo.isBeginMove) {
				this.#setDragElePos(event.x, event.y);
			}
		});
		document.addEventListener('touchmove', (event) => {
			const touch = event.touches[0];
			if (this.beginMoveInfo.isBeginMove) {
				this.#setDragElePos(touch.clientX, touch.clientY);
			}
		});

		document.addEventListener('mouseup', (event) => {
			this.beginMoveInfo = {...this.beginMoveInfo, isBeginMove: false }
		});
		document.addEventListener('touchend', (event) => {
			this.beginMoveInfo = {...this.beginMoveInfo, isBeginMove: false }
		});

	}


}