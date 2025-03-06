// API基础URL
const BASE_URL = 'http://192.168.194.9:8080';

// 请求拦截器
const requestInterceptor = (config) => {
  // 获取token
  const token = uni.getStorageSync('token');
  
  // 如果有token，添加到请求头
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    };
  }
  
  return config;
};

// 响应拦截器
const responseInterceptor = (response) => {
  // 如果返回401，可能是token过期，清除token并跳转到登录页
  if (response.statusCode === 401) {
    uni.removeStorageSync('token');
    uni.removeStorageSync('userInfo');
    
    uni.showToast({
      title: '登录已过期，请重新登录',
      icon: 'none'
    });
    
    // 延迟跳转到登录页
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/login/login'
      });
    }, 1500);
    
    return Promise.reject({
      message: '登录已过期，请重新登录'
    });
  }
  
  return response;
};

// 请求方法封装
const request = (url, method, data, header = {}) => {
  // 创建请求配置
  const config = {
    url: `${BASE_URL}${url}`,
    method,
    data,
    header: {
      'Content-Type': 'application/json',
      ...header
    }
  };
  
  // 应用请求拦截器
  const interceptedConfig = requestInterceptor(config);
  
  return new Promise((resolve, reject) => {
    uni.request({
      ...interceptedConfig,
      success: (res) => {
        // 应用响应拦截器
        const interceptedRes = responseInterceptor(res);
        
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject({
            message: res.data?.msg || '请求失败',
            ...res
          });
        }
      },
      fail: (err) => {
        reject({
          message: '网络错误，请稍后重试',
          ...err
        });
      }
    });
  });
};

export default request; 