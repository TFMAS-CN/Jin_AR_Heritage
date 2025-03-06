import request from './request';

// 用户相关接口
export default {
	// 用户登录
	login: (data) => {
		return request('/api/user/login', 'POST', data);
	},

	// 用户注册
	register: (data) => {
		return request('/api/user/register', 'POST', data);
	},

	// 获取用户信息
	getUserInfo: () => {
		return request('/api/user/info', 'GET');
	},

	// 更新用户信息
	updateUserInfo: (data) => {
		return request('/api/user/update', 'PUT', data);
	},

	// 修改密码
	changePassword: (data) => {
		return request('/api/user/password', 'PUT', data);
	},

	// 退出登录
	logout: () => {
		return request('/api/user/logout', 'POST');
	},

	// 获取首页数据
	home: () => {
		return request('/api/home', 'GET');
	}
};