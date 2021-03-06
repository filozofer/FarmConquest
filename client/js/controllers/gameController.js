

define(['jquery', '../lib/jquery-ui', '../lib/vector2', '../lib/fcl', '../entity/tile', './farmerController'], function(jQuery, ui, Vector2, FCL, Tile, FarmerController) {

    jQuery.noConflict();
    var $j = jQuery;
    var GameController = Class.create();
    GameController.prototype = {

        initialize: function(app){
            this.canvas = undefined;
            this.app = app;
            //this.farmerController = undefined;
        },

        initEvents: function(){

            var self = this;

            GLOBAL_GAMECONTROLLER = new Object();

            //Add reverting event to draggable object
            $j.ui.draggable.prototype._mouseStop = function(event) {
                //If we are using droppables, inform the manager about the drop
                var dropped = false;
                if ($j.ui.ddmanager && !this.options.dropBehaviour)
                    dropped = $j.ui.ddmanager.drop(this, event);

                //if a drop comes from outside (a sortable)
                if(this.dropped) {
                    dropped = this.dropped;
                    this.dropped = false;
                }

                if((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($j.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
                    var self = this;
                    self._trigger("reverting", event);
                    $j(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
                        event.reverted = true;
                        self._trigger("stop", event);
                        self._clear();
                    });
                } else {
                    this._trigger("stop", event);
                    this._clear();
                }

                return false;
            }

            $j(document).on('startGame', function() {
                self.startGame();
            });

            //Get map to draw from server
            socket.on('drawMap', function(resp){
                $j("#section_loadingMap").hide();
                self.canvas.clearCanvas();
                self.drawMap(resp.worldToDraw, resp.dimension);
                self.drawMapTexture();
                if (resp.isRefresh){
                    $j(document).trigger('FARMER-drawFarmer');
                } else {
                self.refreshFarmerController();
                }
            });

            socket.on('drawElement', function(resp){
               self.drawElement(resp);
            });

            $j(document).on('TILE-GAME-mouseOver', function(e, tile) {
                self.changeNotifTileZone(tile);
            });

            $j(document).on('GAME-updateDisplayedMap', function() {
                self.canvas.clearCanvas();
                self.drawMapTexture();
                //clear list of ennemies before refresh -> avoid same ennemy twice
                socket.sessions.ennemies.length = 0;
                // CALL SERVER TO LOAD NEW MAP TO DISPLAYED FROM NEW POSITION
                socket.emit('changeWorldCenter', app.World.center);
            });

            socket.on('farmPositionForTeleport', function(tile){
                var farmerImg = self.app.Ressources["farmer"];

                var positionPx = new Vector2(self.app.World[tile.X][tile.Y].XPx, self.app.World[tile.X][tile.Y].YPx - ((farmerImg.height  / self.app.Config.farmerSpriteNbLine) /2));
                socket.sessions.farmer.X = tile.X;
                socket.sessions.farmer.Y = tile.Y;
                socket.sessions.farmer.XPx = positionPx.X;
                socket.sessions.farmer.YPx = positionPx.Y;
                self.canvas.removeFarmerSprite(socket.sessions.farmer);
                self.canvas.putFarmerSprite(positionPx, farmerImg, socket.sessions.farmer, self.canvas.L_NAME.players);

                socket.emit('teleportToFarm', {ennemy: socket.sessions.farmer, tile: tile});
                self.canvas.stage.fire("dragMapToFarm");
            });

            $j("#mg_teleport").on('click', function(){
                //If the farmer don't walk we send a request for teleport to the server
                if(!socket.sessions.farmer.isWalking)
                {
                    socket.emit('getFarmPositionForTeleport');
                }
            });

            socket.on('GAME-missingWorld', function(resp){

                for(var i=resp.begin.X; i<resp.finish.X; i++){
                    for (var j=resp.begin.Y; j<resp.finish.Y; j++){
                        var currentMissingTile = resp.missingWorld[i][j];

                        if (app.World[i] == undefined){
                            app.World[i] = new Object();
                        }

                        app.World[i][j] = new Tile(currentMissingTile.X, currentMissingTile.Y);
                        app.World[i][j].setContentTile(currentMissingTile.contentTile);
                        app.World[i][j].owner = currentMissingTile.owner;
                        app.World[i][j].humidity = currentMissingTile.humidity;
                        app.World[i][j].fertility = currentMissingTile.fertility;
                    }
                }

            });

            this.tilesModifyEye = undefined;
            $j(document).on('mouseenter mouseleave', "#mg_eye_owner", function(ev){

                var mouse_is_inside = ev.type === 'mouseenter';

                if(mouse_is_inside)
                    $j("#mg_eye_owner").attr('src', "img/gameMenu/buttonEyeOwnerRed.png");
                else
                    $j("#mg_eye_owner").attr('src', "img/gameMenu/buttonEyeOwner.png");

                var username = socket.sessions.currentUser.username;
                self.tilesModifyEye = new Array();
                var screenMinX = self.app.Config.screenMinX;
                var screenMaxX = self.app.Config.screenMaxX;
                var screenMinY = self.app.Config.screenMinY;
                var screenMaxY = self.app.Config.screenMaxY;
                //Get tiles not own by the current player
                for(var i = screenMinX; i < screenMaxX; i++)
                {
                    for(var j = screenMinY; j < screenMaxY; j++)
                    {
                        if(app.World[i] != undefined && app.World[i][j] != undefined)
                        {
                            if(app.World[i][j].owner != undefined && app.World[i][j].owner.name != username)
                            {
                                self.tilesModifyEye.push(app.World[i][j]);
                            }
                        }
                    }
                }

                //For each tiles change opacity
                var opacityChange = (mouse_is_inside) ? -0.7 : +0.7;
                for(var i = 0; i < self.tilesModifyEye.length; i++)
                {
                    if(self.tilesModifyEye[i].image != undefined)
                    {
                        self.tilesModifyEye[i].image.setOpacity(self.tilesModifyEye[i].image.getOpacity() + opacityChange);
                    }
                    else
                    {
                        if (self.tilesModifyEye[i].contentTile != undefined){
                            var mainPos = self.tilesModifyEye[i].contentTile.mainPos;
                            if(app.World[mainPos.X][mainPos.Y].image != undefined)
                            {
                                app.World[mainPos.X][mainPos.Y].image.setOpacity(app.World[mainPos.X][mainPos.Y].image.getOpacity() + opacityChange);
                            }
                        }
                    }
                }

            });

            $j(document).on('GAME-bagReceive', function(){
                $j(".mg_item_bag").draggable({
                    start: function() {
                        $j(this).attr('idBag', $j(this).parent().attr('idBag'));
                        $j(this).attr('iditem', $j(this).parent().attr('iditem'));

                        if($j('#mg_trash_itemBag').css("left") != "0px")
                        {
                            $j('#mg_trash_itemBag').hide();
                            $j('#mg_trash_itemBag').css('left', '0px');
                            $j('#mg_trash_itemBag').show("slide", {}, 300);
                        }

                        $j(this).css('z-index', '9');
                    },
                    revert: "invalid",
                    reverting: function(){
                        if($j('#mg_trash_itemBag').css("left") == "0px")
                        {
                            $j('#mg_trash_itemBag').hide("slide", {}, 300, function(){
                                $j('#mg_trash_itemBag').css('left', '-1000px');
                            });
                        }
                    }
                });
                $j(".mg_item_bag").on('click', function(){
                    var idItem = parseInt($j(this).attr("iditem"));
                    var notInBag = $j(this).parent().hasClass('gb_box');
                    if (!(idItem > 100 && idItem < 200) && !notInBag && socket.sessions.selectedActionIndex == undefined) // if not a crop
                    {
                        if(socket.sessions.idItemSelected == undefined)
                        {
                            socket.sessions.idItemSelected = idItem;
                            for (var key in app.Config.idItems){
                                var currentItem = app.Config.idItems[key];
                                if (currentItem.id == socket.sessions.idItemSelected){
                                    if (currentItem.id < 10){
                                        socket.sessions.farmer.isFarming = true; //seed
                                    }
                                    else if (currentItem.id >= 10 && currentItem.id < 20){
                                        socket.sessions.farmer.isBuilding = true;
                                    }
                                    var cursorName = "cursor_"+currentItem.name+".png";
                                    $j("body").css('cursor','url("img/cursors/'+cursorName+'"), progress');
                                    break;
                                }
                            }
                        }
                        else
                        {
                            socket.sessions.idItemSelected = undefined;
                            socket.sessions.farmer.isFarming = false;
                            socket.sessions.farmer.isBuilding = false;
                            $j("body").css('cursor','url("img/cursors/main.cur"), progress');
                        }
                    }
                });
            });

            $j("#mg_trash_itemBag").droppable({
                accept: ".mg_item_bag",
                drop: function( event, ui ) {
                    socket.emit('GAME-itemBagDelete', parseInt($j(ui.draggable).attr('idBag')));
                    $j(ui.draggable).remove();
                    $j('#mg_trash_itemBag').hide("slide", {}, 300, function(){
                        $j('#mg_trash_itemBag').css('left', '-1000px');
                    });
                }
            });

            $j(".mg_bag_box").droppable({
                accept: function(dropElement) {

                    if(dropElement.hasClass('mg_item_bag') && $j(this).html() == "")
                        return true;
                    else
                        return false;
                },

                drop: function( event, ui ) {

                    var clone = "<span class='mg_item_bag'>" + $j(ui.draggable).html() + "</span>";
                    var idItem = parseInt($j(ui.draggable).attr("iditem"));
                    var idBag = parseInt($j(ui.draggable).attr("idBag"));
                    var parentIsBuilding = $j(ui.draggable).parent().hasClass('gb_box');
                    $j(ui.draggable).remove();
                    $j(this).html(clone);
                    $j(this).children('.mg_item_bag').first().attr('iditem', idItem);
                    $j(this).children('.mg_item_bag').first().attr('idBag', idBag);

                    $j('#mb_sell_box_price_zone').hide();
                    $j('#mb_sell_box_sell_button').hide();

                    $j(document).trigger('GAME-bagReceive');

                    //Case ItemBag come from building, set the pos of that building in the request as containerStartPos
                    var tile = new Object();
                    if(socket.sessions.tileBuildingOpen != undefined)
                    {
                        tile.X = socket.sessions.tileBuildingOpen.X;
                        tile.Y = socket.sessions.tileBuildingOpen.Y;
                    }

                    socket.emit('GAME-changePlaceItemBag', { idBag: parseInt($j(ui.draggable).attr('idBag')), newPos: $j(this).attr("idBag"), containerStart: (parentIsBuilding) ? "building": "bag", containerEnd: "bag", containerStartPos: { X: tile.X, Y: tile.Y }});

                    $j('#mg_trash_itemBag').hide("slide", {}, 300, function(){
                        $j('#mg_trash_itemBag').css('left', '-1000px');
                    });
                }
            });

            $j("#mb_sell_box_drop_zone").droppable({
                accept: function(dropElement) {
                    var idItem = parseInt(dropElement.attr('iditem'));
                    if(dropElement.hasClass('mg_item_bag') && $j(this).html() == "" && idItem >= 100 && idItem < 200)
                        return true;
                    else
                        return false;
                },

                drop: function( event, ui ) {

                    var clone = "<span class='mg_item_bag'>" + $j(ui.draggable).html() + "</span>";
                    var idItem = parseInt($j(ui.draggable).attr("iditem"));
                    var idBag = parseInt($j(ui.draggable).attr("idBag"));
                    var quantity = parseInt($j(ui.draggable).children().eq(1).html());
                    $j(ui.draggable).remove();
                    $j(this).html(clone);
                    $j(this).children('.mg_item_bag').first().attr('iditem', idItem);
                    $j(this).children('.mg_item_bag').first().attr('idBag', idBag);

                    $j(document).trigger('GAME-bagReceive');

                    //socket.emit('BOARD-getPriceItem', { idBag: parseInt($j(ui.draggable).attr('idBag'))});
                    var price = $j('#market_info' + idItem).children('.market_info_price').first().children().first().html();
                    price = parseInt(price);

                    $j('#mb_sell_box_price_zone').html(" X " + price + " = " + price * quantity + "<img src='img/gameBoard/miniCoin.png' width='20' alt='coin'/>");
                    $j('#mb_sell_box_price_zone').show();
                    $j('#mb_sell_box_sell_button').show();

                    $j('#mg_trash_itemBag').hide("slide", {}, 300, function(){
                        $j('#mg_trash_itemBag').css('left', '-1000px');
                    });
                }
            });

            $j(document).on('mouseenter mouseleave', "#gb_quit", function(ev){
                var mouse_is_inside = ev.type === 'mouseenter';
                if(mouse_is_inside)
                    $j("#gb_quit").attr('src', "img/gameBoard/cross_active_button.png");
                else
                    $j("#gb_quit").attr('src', "img/gameBoard/cross_clean_button.png");
            });
            $j('#gb_quit').on('click', function(){
                $j('#game_building_ui').fadeOut(300);
            });

            socket.on('GAME-putContentBuilding', function(resp){

                var items = resp.items;
                var tile = resp.tile;
                socket.sessions.tileBuildingOpen = tile;
                var contentTile = resp.tile.contentTile;

                $j('#game_building_ui').fadeOut(300, function(){

                    if(items != undefined)
                    {
                        //Clean stock in ui
                        $j('#gb_table').html("<tr></tr><tr></tr>");

                        //Get number of box to create
                        //Change window properties
                        var length = undefined;
                        switch(contentTile.type)
                        {
                            case self.app.Config.tileType.grangeP:
                                length = 2;
                                $j('#gb_quit').css('left', '137px');
                                $j('#game_building_ui').css({
                                    'left': '400px',
                                    'width': '170px',
                                    'height': '115px'
                                });
                                break;

                            case self.app.Config.tileType.grangeM:
                            case self.app.Config.tileType.grangeG:
                                length = 10;
                                $j('#gb_quit').css('left', '290px');
                                $j('#game_building_ui').css({
                                    'left': '319px',
                                    'width': '330px',
                                    'height': '159px'
                                });
                                break;

                            default:
                                length = 0;
                                break;
                        }

                        //Create the boxs
                        for (var i=0; i < length; i++){
                            $j('#gb_table tr').eq((i < 5) ? 0 : 1).append("<td class='gb_box' idBag='" + i + "'></td>");
                        }

                        //Fill the box with items send by server
                        for(var i = 0; i < items.length; i++)
                        {
                            var itemBag = items[i];
                            var content = "<span class='mg_item_bag' iditem='" + itemBag.idItem + "'><span class='mg_bag_item bagItem" + itemBag.idItem + "'></span><span class='bagItem_quantity'>" + itemBag.quantity + "</span></span>";

                            $j(".gb_box[idBag='" + itemBag.positionInBag + "']").html(content);
                        }
                    }

                    //Droppable zone refresh
                    $j(".gb_box").droppable({
                        accept: function(dropElement) {

                            if(dropElement.hasClass('mg_item_bag') && $j(this).html() == "")
                                return true;
                            else
                                return false;
                        },

                        drop: function( event, ui ) {

                            var clone = "<span class='mg_item_bag'>" + $j(ui.draggable).html() + "</span>";
                            var idItem = parseInt($j(ui.draggable).attr("iditem"));
                            var idBag = parseInt($j(ui.draggable).attr("idBag"));
                            var parentIsBuilding = $j(ui.draggable).parent().hasClass('gb_box');
                            $j(ui.draggable).remove();
                            $j(this).html(clone);
                            $j(this).children('.mg_item_bag').first().attr('iditem', idItem);
                            $j(this).children('.mg_item_bag').first().attr('idBag', idBag);

                            $j('#mb_sell_box_price_zone').hide();
                            $j('#mb_sell_box_sell_button').hide();

                            $j(document).trigger('GAME-bagReceive');

                            socket.emit('GAME-changePlaceItemBag', { idBag: parseInt($j(ui.draggable).attr('idBag')), newPos: $j(this).attr("idBag"), containerStart: (parentIsBuilding) ? "building": "bag", containerEnd: "building", containerStartPos: { X: tile.X, Y: tile.Y }, containerEndPos: { X: tile.X, Y: tile.Y }});

                            $j('#mg_trash_itemBag').hide("slide", {}, 300, function(){
                                $j('#mg_trash_itemBag').css('left', '-1000px');
                            });
                        }
                    });

                    $j(document).trigger('GAME-bagReceive');

                    //fadeIn
                    $j('#game_building_ui').fadeIn(300);
                });

            });

            socket.on('GAME-updateFarmerAttributes', function(resp){
                $j('#mg_money_joueur').html(resp.money);
                $j('#mg_credits_conquest').html(resp.creditConquest);
                socket.sessions.farmer.money = resp.money;
                socket.sessions.farmer.level = resp.level;
                socket.sessions.farmer.experiences = resp.experiences;
                socket.sessions.farmer.creditFight = resp.creditFight;
                socket.sessions.farmer.creditConquest = resp.creditConquest;
            });

            $j("#tile_image_box").hide();
        },

        startGame: function() {
            //Draw Game Canvas
            this.canvas = new FCL("section_canvas", 980, 440);
        },

        drawMap: function(worldToDraw, dimension) {

            var serverWorld = worldToDraw;
            var world = this.app.World;
            world.center = serverWorld.center;

            var centerScreen = new Object();
            centerScreen.X = this.canvas.stage.attrs.width/2;
            centerScreen.Y = this.canvas.stage.attrs.height/2;
            // CENTER = 0,0
            var tileCenter = new Tile(world.center.X, world.center.Y);

            var ScreenMinX = dimension.minX;
            var ScreenMaxX = dimension.maxX;
            var ScreenMinY = dimension.minY;
            var ScreenMaxY = dimension.maxY;

            this.app.Config.screenMinX = ScreenMinX;
            this.app.Config.screenMaxX = ScreenMaxX;
            this.app.Config.screenMinY = ScreenMinY;
            this.app.Config.screenMaxY = ScreenMaxY;

            var tileWidth = this.app.Config.tileWidth;
            var tileHeight = this.app.Config.tileHeight;

            for(var i=ScreenMinX; i<ScreenMaxX; i++){
                if (serverWorld[i] != undefined){
                    world[i] = new Object();
                    for(var j=ScreenMinY; j<ScreenMaxY; j++){

                        if(serverWorld[i][j] != undefined){
                            var element = serverWorld[i][j];
                            var tileX = element.X;
                            var tileY = element.Y;
                            world[i][j] = new Tile(tileX, tileY);
                            world[i][j].setContentTile(element.contentTile);
                            world[i][j].owner = element.owner;
                            world[i][j].humidity = element.humidity;
                            world[i][j].fertility = element.fertility;

                            var tile = world[i][j];
                            tile.XPx = centerScreen.X - ((tile.Y - tileCenter.Y) * (tileWidth/2)) +((tile.X - tileCenter.X) * (tileWidth/2)) - (tileWidth/2);
                            tile.YPx = centerScreen.Y + ((tile.Y - tileCenter.Y) * (tileHeight/2)) +((tile.X - tileCenter.X) * (tileHeight/2)) - (tileHeight/2);
                            world[i][j] = tile;

                            if (tile.X == world.center.X && tile.Y == world.center.Y){
                                world.center.XPx = tile.XPx;
                                world.center.YPx = tile.YPx;
                            }
                        }
                    }
                }
            }
            if (world.center.XPx == undefined){
                world.center.XPx = this.canvas.stage.attrs.width/2 - this.app.Config.tileWidth/2;
            }
            if (world.center.YPx == undefined){
                world.center.YPx = this.canvas.stage.attrs.height/2 - this.app.Config.tileHeight/2;
            }
            this.app.World = world;

            //this.drawMapTexture();
        },

        drawMapTexture: function(){
            var tileWidth = this.app.Config.tileWidth;
            var tileHeight = this.app.Config.tileHeight;
            var world = this.app.World;
            var countCurrentTile = 1;
            for (var i=this.app.Config.screenMinX; i<this.app.Config.screenMaxX; i++){
                for (var j=this.app.Config.screenMinY; j<this.app.Config.screenMaxY; j++){
                    if(world[i] != undefined)
                    {
                        var tile = world[i][j];
                        if(tile != undefined)
                        {
                            if(tile.XPx >= -tileWidth &&
                                tile.XPx <= this.canvas.stage.attrs.width + tileWidth &&
                                tile.YPx >= -tileHeight &&
                                tile.YPx <= this.canvas.stage.attrs.height + tileHeight)
                            {

                                //Check contentTile not empty
                                if(tile.contentTile != undefined)
                                {
                                    switch(tile.contentTile.type)
                                    {
                                        case self.app.Config.tileType.farm:
                                            if(tile.contentTile.mainPos.X == tile.X && tile.contentTile.mainPos.Y == tile.Y)
                                                this.canvas.putTexture(new Vector2(tile.XPx - tileWidth / 2 + 5, tile.YPx - 100), this.app.Ressources[app.Config.tileType.farm] , world[i][j], this.canvas.L_NAME.buildings, countCurrentTile);
                                            break;

                                        case self.app.Config.tileType.seed:
                                            this.canvas.putSeedSprite(new Vector2(tile.XPx, tile.YPx), this.canvas.getImageFromType(tile.contentTile.type), world[i][j], this.canvas.L_NAME.tiles, countCurrentTile);
                                            break;

                                        case self.app.Config.tileType.grangeP:
                                            if(tile.contentTile.mainPos != undefined && tile.contentTile.mainPos.X == tile.X && tile.contentTile.mainPos.Y == tile.Y)
                                                this.canvas.putTexture(new Vector2(tile.XPx, tile.YPx - 48), this.app.Ressources[app.Config.tileType.grangeP] , world[i][j], this.canvas.L_NAME.buildings, countCurrentTile);
                                            break;

                                        case self.app.Config.tileType.grangeM:
                                            if(tile.contentTile.mainPos != undefined && tile.contentTile.mainPos.X == tile.X && tile.contentTile.mainPos.Y == tile.Y)
                                                this.canvas.putTexture(new Vector2(tile.XPx - tileWidth / 2, tile.YPx - (71 - tileHeight)), this.app.Ressources[app.Config.tileType.grangeM] , world[i][j], this.canvas.L_NAME.buildings, countCurrentTile);
                                            break;

                                        case self.app.Config.tileType.grangeG:
                                            if(tile.contentTile.mainPos != undefined && tile.contentTile.mainPos.X == tile.X && tile.contentTile.mainPos.Y == tile.Y)
                                                this.canvas.putTexture(new Vector2(tile.XPx - (tileWidth+5), tile.YPx - (105 - tileHeight)), this.app.Ressources[app.Config.tileType.grangeG] , world[i][j], this.canvas.L_NAME.buildings, countCurrentTile);
                                            break;
                                        default:
                                            break;
                                    }
                                }
                                else
                                {
                                    this.canvas.putTexture(new Vector2(tile.XPx, tile.YPx), this.app.Ressources["default_tile"] , world[i][j], this.canvas.L_NAME.tiles, countCurrentTile);
                                }

                                countCurrentTile++;
                            }
                        }
                    }
                }
            }
        },

        refreshFarmerController: function(){
            //REFRESH FARMERCONTROLLER PARAMETERS WHEN WORLD LOADED
            $j(document).trigger('FARMER-canvasLoaded', [this.app, this.canvas]);
            socket.emit('getFarmerPosition');
        },

        drawElement: function(resp) {
            var tile = new Tile(resp.element.X, resp.element.Y);
            tile.setContentTile(resp.element);
            this.canvas.changeTexture(tile);
        },

        changeNotifTileZone: function(tile){

            var tileBoard = this.app.World[tile.X][tile.Y];

            //Name //Description
            if(tileBoard.contentTile != undefined)
            {
                $j("#tile_name_content").html(tileBoard.contentTile.name);
                $j("#tile_infos_content").html(tileBoard.contentTile.description);
            }
            else
            {
                $j("#tile_name_content").html("Terre");
                $j("#tile_infos_content").html("");
            }

            //Image
            if(tileBoard.image != undefined)
            {
                if(tileBoard.contentTile != undefined && tileBoard.contentTile.type == "seed")
                {
                    $j('#tile_image_box').css('background-image', 'url("img/Farming/farming_set.png")');
                    var horizontal = '-' + (((tileBoard.contentTile.state > 2) ? 2 : tileBoard.contentTile.state) * 80) + 'px ';
                    var vertical = '-' + ((tileBoard.contentTile.idItem - 1) * 60) + 'px';
                    var test = horizontal + vertical;
                    $j('#tile_image_box').css('background-position', test);
                    $j("#tile_image").hide();
                    $j('#tile_image_box').show();
                }
                else
                {
                    $j("#tile_image").attr("src", tileBoard.image.attrs.image.src);
                    if(tileBoard.contentTile == undefined)
                        $j("#tile_image").css('margin-top', '20px');
                    else
                        $j("#tile_image").css('margin-top', '0px');
                    $j("#tile_image_box").hide();
                    $j("#tile_image").show();
                }
            }
            else if(tileBoard.contentTile != undefined && tileBoard.contentTile.mainPos != undefined) //Case building
            {
                $j("#tile_image").attr("src", this.app.World[tileBoard.contentTile.mainPos.X][tileBoard.contentTile.mainPos.Y].image.attrs.image.src);
                $j("#tile_image").css('margin-top', '0px');
                $j("#tile_image_box").hide();
                $j("#tile_image").show();
            }

            //Owner
            if(tileBoard.owner != undefined)
            {
                $j("#tile_owner").html(tileBoard.owner.name);
            }
            else
            {
                $j("#tile_owner").html("Neutre");
            }

            //Humidity
            if(tileBoard.humidity != undefined)
                $j("#tile_humidity_level").html(tileBoard.humidity + " / 10");
            else
                $j("#tile_humidity_level").html("0 / 10");

            //Fertility
            if(tileBoard.fertility != undefined)
                $j("#tile_fertility_level").html(tileBoard.fertility + " / 10");
            else
                $j("#tile_fertility_level").html("0 / 10");

        },

        getRandomInArray: function(arrayR){
            var random = Math.floor((Math.random()*arrayR.length));
            return arrayR[random];
        }


    };

    return GameController;

});
