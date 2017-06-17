function BattleShip(element, config) {
    this._targetElement = element;
    this.config = config;
    this.ships = [];
}
BattleShip.prototype = {
    init: function () {
        this.initialiseBoard();
        this.placeDefaultShips();
        this.makeShipsDraggable();
        this.showSavePositionButton();
    },
    initialiseBoard: function () {
        var board = $("<div class='bfboard'>");
        board.css("width", this.config.width * 2 + 'em');
        var grid = $("<table class='bftable'>");
        for (var i = 0; i < this.config.height; i++) {
            var row = $("<tr class='bfrow'>");
            for (var j = 0; j < this.config.width; j++) {
                var cell = $("<td class='bfcell'>");
                row.append(cell);
            }
            grid.append(row);
        }
        $(board).append(grid);
        $(this._targetElement).append(board);
    },
    placeDefaultShips: function () {
        var board = $(this._targetElement).find(".bfboard");
        var maxColOccupied = 0, maxRowOccupied = 0, currentTop = 0;
        for (var i = 0; i < this.config.ships.length; i++) {
            var shipContainer = $("<div class='shipcontainer' id='" + i + "'>");
            for (var j = 0; j < this.config.ships[i].lines.length; j++) {
                var line = this.config.ships[i].lines[j];
                var shipLine = $("<div class='shipline'>");
                shipLine.css("height", line[0] * 2 + 'em');
                shipLine.css("width", '2em');
                shipLine.css("top", line[1] * 2 + 'em');
                shipLine.css("left", line[2] * 2 + 'em');
                shipContainer.append(shipLine);
            }
            board.append(shipContainer);

            shipContainer.css("left", maxColOccupied * 2 + 'em');
            maxColOccupied += this.findShipWidth(this.config.ships[i].lines) + 1;

            if (this.findShipHeight(this.config.ships[i].lines) + currentTop > maxRowOccupied) {
                maxRowOccupied = this.findShipHeight(this.config.ships[i].lines) + currentTop;
            }

            shipContainer.css("top", currentTop * 2 + 'em');

            if (maxColOccupied >= this.config.width) {
                maxColOccupied = 0;
                currentTop = maxRowOccupied + 1;
            }
        }
    },

    findShipWidth: function (lines) {
        return lines.reduce(function (a, b) {
            return a[2] > b[2] ? a[2] + 1 : b[2] + 1;
        }, [0, 0, 0])
    },

    findShipHeight: function (lines) {
        return lines.reduce(function (a, b) {
            return a[0] + a[1] > b[0] + b[1] ? a[0] + a[1] : b[0] + b[1];
        }, [0, 0, 0])
    },

    makeShipsDraggable: function () {
        var that = this;
        $(".shipcontainer").draggable({
            grid: [32, 32],
            containment: "parent",
            revert: 'invalid'
        });
        $(".bfboard").droppable({
            accept: function (el) {
                if (that.isShipOverlapping(el)) {
                    return false;
                }
                return true;
            },
            tolerance: "touch"
        });
    },

    isShipOverlapping: function (el) {
        var shipOffset = $(el).offset();
        var shipHeight = this.findShipHeight(this.config.ships[$(el).attr("id")].lines) * 32;
        var shipWidth = this.findShipWidth(this.config.ships[$(el).attr("id")].lines) * 32;
        var $elements = $(".bfboard .shipline").map(function () {
            var $this = $(this);
            if (el.has($this).length) {
                return null;
            }
            var offset = $this.offset();
            var l = offset.left;
            var t = offset.top;
            var h = $this.height();
            var w = $this.width();

            var maxx = l + w;
            var maxy = t + h;

            var horizontalCrossing = (t >= shipOffset.top && t <= shipOffset.top + shipHeight) || ((t + h) >= shipOffset.top && (t + h) <= shipOffset.top + shipHeight);
            var verticalCrossing = (l >= shipOffset.left && l <= shipOffset.left + shipWidth) || ((l + w) >= shipOffset.left && (l + w) <= shipOffset.left + shipWidth);
            if (horizontalCrossing && verticalCrossing) {
                return $this;
            }
            return null;

        });
        if ($elements.length > 0) {
            return true;
        }
    },
    showSavePositionButton:function() {
        var that = this;
        var savePositionButton = $("<button>Save Position (position is logged in console for now)</button>");
        savePositionButton.click(function(){
            that.sendPosition();
        })
        $(this._targetElement).append(savePositionButton);
    },

    sendPosition:function() {
        var shipData = this.config.ships.map(function(ship,index){
            var shipDetail = ship;
            shipDetail.positionX = $(".shipcontainer#"+index).position().left/32;
            shipDetail.positionY = $(".shipcontainer#"+index).position().top/32;
            return shipDetail;
        });
        console.log("Ships with position:",shipData);
    }

}