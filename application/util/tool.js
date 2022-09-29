export const formatSTime = (second) => {
    let h = 0, i = 0, s = parseInt(second);
    if (s > 60) {
      i = parseInt(s / 60);
      s = parseInt(s % 60);
    }
    // 补零
    let zero = function (v) {
      return (v >> 0) < 10 ? "0" + v : v;
    };
    return [zero(i), zero(s)].join(":");
};

// 格式化时间
export const forTime = (duration) => {
  const time = duration;
  const  h = Math.floor(time / 3600);
  const  m = Math.floor((time / 60 % 60));
  const  s = Math.floor((time % 60));

  if (time < 60){
      return   s + '秒';
  } else if ( time > 60  && time < 3600){
      return  m + '分' + s + '秒';
  } else if (time > 3600){
      return  h + '小时' + m + '分' + s + '秒';
  }
};

export const ts2dt = (timestamp) => {
  let ts = timestamp * 1000;
  const date = new Date(ts);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  const year = date.getFullYear();
  const month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  // const hour = date.getHours() + ':';
  // const minutes = date.getMinutes() + ':';
  // const second = date.getSeconds();
  return `${year}年${month}月${day}日`;
};

export const ts2hour = (ts) => {
  return parseFloat(ts / 3600).toFixed(1) + '小时';
};

export const isBase64 = (str) => {
  if (str ==='' || str.trim() ==='') { 
    return false; 
  }
  
  try {
      return btoa(atob(str)) == str;
  } catch (err) {
      return false;
  }
}