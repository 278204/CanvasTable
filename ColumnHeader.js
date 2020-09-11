import View from './View.js'

const alphabet = [...Array(26)].map((q,i) => String.fromCharCode(i+65))

export default class ColumnHeader extends View {
    constructor(frame, columns, onColumnSizeChange) {
        super(frame)
        this.onMousemove = this.onMousemove.bind(this)
        this.onMouseup = this.onMouseup.bind(this)
        this.backgroundColor = "white"

        this.columns = columns
        this.onColumnSizeChange = onColumnSizeChange

        this.xOffset = 0

        this.cursor = { down: false, start: undefined, column: undefined }
    }

    moveTo(column) {
        this.xOffset = column
    }

    onMousedown(event) {
        const column = this.getColumnAtPoint(event.point.x)
        this.cursor.column = column
        this.cursor.down = true
        this.cursor.start = { ... event.point }
        document.addEventListener('mousemove', this.onMousemove)
        document.addEventListener('mouseup', this.onMouseup)
        this.repaint()
    }
    onMousemove(event) {
        const point = this.getPointInView(event.layerX, event.layerY)
        const xDelta = point.x - this.cursor.start.x
        this.cursor.start = point
        this.onColumnSizeChange(this.cursor.column, xDelta)
        event.target.style.cursor = 'col-resize'
        this.repaint()
    }
    onMouseup(event) {
        this.cursor.down = false
        this.cursor.column = undefined
        event.target.style.cursor = 'default'
        document.removeEventListener('mousemove', this.onMousemove)
        document.removeEventListener('mouseup', this.onMouseup)
        this.repaint()
    }

    paint(canvas, timestamp) {
        let xOffset = 0
        for (let i = this.xOffset; i < this.columns.length; i++) {
            const col = this.columns[i]
            
            canvas.drawText(xOffset + (col.width / 2), 15, this.getText(i), 'center', 'black')
            
            xOffset += col.width
            if (xOffset > this.frame.width) {
                break
            }
        }
    }
    
    getColumnAtPoint(x) {
        let offset = 0
        for (let i = this.xOffset; i < this.columns.length; i++) {
            const column = this.columns[i]
            if (offset < x && x < offset + column.width) {
                return i
            }
            offset += column.width
        }
        return undefined
    }
    getText(i) {
        const al = alphabet.length
        const q = Math.floor(i / al)
        const remainder = i % al
        const ar = alphabet[remainder]
        if (q <= 0) {
            return ar;
        }
        return this.getText(q - 1) + ar
    }
}
