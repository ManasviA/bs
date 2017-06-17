function BattleShip(element, config) {
    this._targetElement = element;
    this.config = config;
}
BattleShip.prototype = {
    init: function() {
        this.initialiseBoard();
    },
    initialiseBoard:function() {
        var grid = $("<table class='bftable'>");
        for(var i=0;i<this.config.height;i++) {
            var row = $("<tr class='bfrow'>");
            for(var j=0;j<this.config.width;j++) {
                var cell = $("<td class='bfcell'>");
                row.append(cell);
            }
            grid.append(row);
        }
        $(this._targetElement).append(grid);
    }
}