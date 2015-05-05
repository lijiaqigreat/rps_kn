var default_param={
  max_level:20,
  decay:0.9,
  weight:[5,2,1]
};
var param=default_param;
var bot= {
  init: function(_param,data){
  },
  getHand:function()
  {
    var his=this._private.history;
    if(his[0]===undefined){
      return (Math.random()*3)|0;
    }
    //update predict
    //return standard diviation
    var list=[];
    for(var t1=1;t1<his.length;t1++){
      var dist=0;
      var x=1;
      for(var t2=0;t2<his.length;t2++){
        if(his[t2]!==his[t1]){
          dist+=x;
        }
        x*=param.decay;
      }
      list.push([(his[t1-1]/3)|0,dist]);
    }
    list.sort(function(a,b){return b[1]-a[1];});
    var count=[0,0,0];
    list.forEach(function(e,i){
      count[e[0]]+=param.weight[i]|0;
    });
    var m= count[0]>count[1]?(count[0]>count[2]?0:2):(count[1]>count[2]?1:2);
    return (m+1)%3;
  },
  update:function(h1,h0,dt)
  {

    //update history
    for(i=param.max_level-2;i>=0;i--)
    {
      his[i+1]=his[i];
    }
    his[0]=h1*3+h0;
  },
  _private:
  {
    history:Array(param.max_level)
  }
};
self.onmessage=function(e){

  var token=e.data[0];
  var name=e.data[1];
  var args=e.data.slice(2);
  var rtn=bot[name].apply(bot,args);
  if(rtn===undefined){rtn="undefined";}
  self.postMessage({token:token,rtn:rtn});
};
