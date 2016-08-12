window.onload = function() {
    //禁止手机滚动事件
    window.ontouchmove = function(e) {
        e.preventDefault && e.preventDefault();
        e.returnValue = false;
        e.stopPropagation && e.stopPropagation();
        return false;
    }
    document.body.style.overflowX = document.body.style.overflowY = "hidden";
    //开始游戏按钮
    document.getElementById("startBtn").addEventListener("click", function() {
        this.parentNode.parentNode.style.display = "none";
    })

    var intro = document.querySelectorAll(".introduce")[0];
    var share = document.querySelectorAll(".share")[0];
    var gameBar = document.getElementById("game_bar");
    var resultSuccess = document.getElementById("result_success");
    var resultFail = document.getElementById("result_fail")
    var resRetry = document.querySelectorAll(".res_retry");
    var resShare = document.getElementsByClassName("res_share");
    var imgList = document.querySelectorAll("img");
    var rate1 = document.getElementById("rate1");
    var rate2 = document.getElementById("rate2");
    
    intro.addEventListener("click", function() {
        this.style.display = "none";
        app.init();
    }, false)
    share.addEventListener("click", function() {
        this.style.display = "none";
    })
    resRetry[0].addEventListener("click", function() {
        resultSuccess.className = "hide";

        intro.style.display = "block";
    })
    resRetry[1].addEventListener("click", function() {
        resultFail.className = "hide";
        intro.style.display = "block";

    })
    resShare[0].addEventListener("click", function() {
        share.style.display = "block";
    })
    resShare[1].addEventListener("click", function() {
        share.style.display = "block";
    })

    var gameBox = document.getElementById('gameBox');
    var aLi = gameBox.getElementsByTagName('li');
    var timer = null;
    var timer2 = null;
    var rate = 0;
    var score = 0;
    var count = 0;
    var wolfNum = 0;
    var app = {
        init: function() {
            resultSuccess.className = "hide";
            resultFail.className = "hide"
            gameBar.className = "";
            gameBar.className = "timerun";
            app.time = 29;
            app.count = 0;
            app.wolfNum = 0;
            timer = setInterval(function() {
                app.createDiv();
            }, 500);
            timer2 = setInterval(function() {
                if (app.time == 1) {
                    clearInterval(timer);
                    clearInterval(timer2);
                    gameBar.className = "";
                    rate = parseInt((app.count / app.wolfNum).toFixed(2) * 100);

                    if (rate >= 80) {
                        resultSuccess.className = "active";
                        rate1.innerHTML = rate + "%";
                    } else {
                        resultFail.className = "active";
                        rate2.innerHTML = rate + "%";
                    }
                    gameBar.className = "";
                    //                          console.log("你击败了"+rate+"%的大灰狼");
                    //                          share.style.display="block";
                    return;
                }
                app.time--;
                //                      console.log("剩余时间",app.time);
            }, 1000)
        },
        count: 0,
        wolfNum: 0,
        time: 30,
        hasEl: { el0: null, el1: null, el2: null, el3: null, el4: null, el5: null, el6: null, el7: null, el8: null, },
        createDiv: function() {
            var ran = parseInt(Math.random() * 9);
            if (app.hasEl['el' + ran]) {
                app.createDiv();
                return;
            }
            var oDiv = document.createElement('div');
            app.wolfNum++;
            //狼的数量
            //              console.info(app.wolfNum)
            //              if(Math.random()*10<2){
            //                  oDiv.className+="rabbit";
            //              }else{
            //                  oDiv.className+="wolf";
            //              }
            var random = parseInt(Math.random() * 3);
            if (random == 0) {
                oDiv.className = "wolf_before_1";
            } else if (random == 1) {
                oDiv.className = "wolf_before_2";
            } else {
                oDiv.className = "wolf_before_3";
            }
            aLi[ran].children[0].appendChild(oDiv);
            app.hasEl['el' + ran] = 1;
            oDiv.index = ran;
            app.move(oDiv, { top: '5' }, {
                    complete: function() {
                        app.move(oDiv, { top: '100' }, {
                            complete: function() {
                                aLi[ran].children[0].removeChild(oDiv);
                                app.hasEl['el' + ran] = 0;
                            },
                            duration: 700,
                            easing: "ease-out"
                        });
                    },
                    duration: 700,
                    easing: "ease-out"
                })
                //              if(window.ontouchstart){            
            oDiv.addEventListener('touchstart', app.rabbitHide, false);
            //              }else{
            //              oDiv.addEventListener('click',app.rabbitHide,false);                
            //              }

            //                oDiv.timeout = setTimeout(function(){
            //                    aLi[ran].removeChild(oDiv);
            //                    app.hasEl['el'+ran]=0;
            //                },1300)
        },
        rabbitHide: function() {
            var _this = this;
            //clearTimeout(this.timeout);
            //              console.log(this);
            var hammer = this.parentNode.parentNode.children[2];
            var Top = (parseInt(this.style.top) - 40) + 'px';

            hammer.style.top = Top;
            hammer.style.display = "block"
            if (this.className == "wolf_before_1") {
                this.className = "wolf_after_1";
            } else if (this.className == "wolf_before_2") {
                this.className = "wolf_after_2";
            } else {
                this.className = "wolf_after_3";
            }
            clearInterval(this.timer);
            this.removeEventListener("touchstart", app.rabbitHide, false);
            app.count++;
            setTimeout(function() {
                hammer.style.display = "none"

            }, 200)
            setTimeout(function() {
                app.hasEl['el' + _this.index] = null;
                _this.parentNode.removeChild(_this);
            }, 500)
        },
        move: function(obj, json, options) {
            options = options || {};
            options.duration = options.duration || 700;
            options.easing = options.easing || 'ease-out';

            var start = {};
            var dis = {};
            for (var name in json) {
                start[name] = parseFloat(app.getStyle(obj, name));
                dis[name] = json[name] - start[name];
            }

            var count = Math.round(options.duration / 30);
            var n = 0;

            obj.timer && clearInterval(obj.timer);
            obj.timer = setInterval(function() {
                n++;
                for (var name in json) {
                    var a = 1;
                    switch (options.easing) {
                        case 'ease-in':
                            var a = n / count;
                            a = a * a
                            var cur = start[name] + dis[name] * n * a / count;
                            break;
                        case 'ease':
                            var cur = start[name] + dis[name] * n / count;
                            break;
                        case 'ease-out':
                            var a = n / count;
                           a =a*a;
                            var cur = start[name] + dis[name] * n / count;
                            break;
                    }


                    if (name == 'opacity') {
                        obj.style.opacity = cur;
                        obj.style.filter = "alpha(opacity=cur*100)";
                    } else {
                        obj.style[name] = cur + 'px';
                    }
                }
                if (n == count) {
                    clearInterval(obj.timer);
                    options.complete && options.complete();
                }
            }, 30)
        },
        getStyle: function(obj, name) {
            return obj.currentStyle ? obj.currentStyle[name] : getComputedStyle(obj, false)[name];
        }
    }

}
