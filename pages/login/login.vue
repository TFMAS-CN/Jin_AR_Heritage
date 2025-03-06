<template>
	<view class="login-container">
		<!-- 背景装饰 -->
		<view class="background-decoration">
			<view class="bg-circle circle-1"></view>
			<view class="bg-circle circle-2"></view>
			<view class="bg-circle circle-3"></view>
			<image class="bg-pattern" src="/static/login/pattern.png" mode="aspectFill"></image>
		</view>

		<!-- 返回按钮 -->
		<view class="back-btn" @tap="goBack">
			<uni-icons type="arrow-left" size="20" color="#00a57a"></uni-icons>
			<text>返回</text>
		</view>

		<!-- 登录标题 -->
		<view class="login-header">
			<view class="login-title">欢迎回来</view>
			<view class="login-subtitle">登录您的账户，探索晋韵古建</view>
		</view>

		<!-- 登录表单 -->
		<view class="login-form">
			<!-- 手机号输入框 -->
			<view class="input-item phone-item" :class="{ 'input-focus': phoneInputFocus }">
				<view class="input-icon">
					<uni-icons type="person-filled" size="22" color="#008055"></uni-icons>
				</view>
				<input type="text" v-model="loginForm.username" placeholder="请输入用户名" maxlength="20"
					@focus="phoneInputFocus = true" @blur="phoneInputFocus = false" />
				<view class="input-clear" v-if="loginForm.username" @tap="loginForm.username = ''">
					<uni-icons type="clear" size="18" color="#c0c4cc"></uni-icons>
				</view>
			</view>

			<!-- 密码输入框 -->
			<view class="input-item password-item" :class="{ 'input-focus': passwordInputFocus }">
				<view class="input-icon">
					<uni-icons type="locked-filled" size="22" color="#00a57a"></uni-icons>
				</view>
				<input v-model="loginForm.password" placeholder="请输入密码" maxlength="11"
					@focus="passwordInputFocus = true" @blur="passwordInputFocus = false" />

				<!-- <input type="number" v-model="loginForm.username" placeholder="请输入手机号" maxlength="11"
					@focus="phoneInputFocus = true" @blur="phoneInputFocus = false" /> -->
				<view class="password-strength" v-if="loginForm.password && passwordInputFocus">
					<view class="strength-bar">
						<view class="strength-level" :class="passwordStrengthClass"></view>
					</view>
					<text class="strength-text">{{ passwordStrengthText }}</text>
				</view>
				<view class="password-toggle" @tap="togglePasswordVisibility">
					<uni-icons :type="showPassword ? 'eye-filled' : 'eye-slash-filled'" size="22"
						:color="showPassword ? '#00a57a' : '#c0c4cc'"></uni-icons>
				</view>
			</view>

			<!-- 操作区域 -->
			<view class="action-area">
				<view class="register-link" @tap="openRegisterPopup">
					<uni-icons type="person-add-filled" size="14" color="#00a57a"></uni-icons>
					<text>注册账号</text>
				</view>
				<view class="forgot-password" @tap="forgotPassword">
					<uni-icons type="help-filled" size="14" color="#00a57a"></uni-icons>
					<text>忘记密码?</text>
				</view>
			</view>

			<!-- 登录按钮 -->
			<button class="login-btn" :disabled="isLoading" @tap="handleLogin">
				<text v-if="!isLoading">登录</text>
				<view v-else class="loading-icon">
					<uni-icons type="spinner-cycle" size="20" color="#ffffff"></uni-icons>
				</view>
			</button>

			<!-- 第三方登录 -->
			<view class="third-party-login">
				<view class="divider"></view>
				<text>第三方登录</text>
				<view class="divider"></view>
			</view>

			<!-- 第三方登录图标 -->
			<view class="third-party-icons">
				<view class="icon-item qq" @tap="thirdPartyLogin('qq')">
					<image src="/static/login/qq.jpg" mode="aspectFit"></image>
				</view>
				<view class="icon-item wechat" @tap="thirdPartyLogin('wechat')">
					<image src="/static/login/wechat.jpg" mode="aspectFit"></image>
				</view>
			</view>
		</view>

		<!-- 底部版权信息 -->
		<view class="footer">
			<text>晋韵古建 © 2023 版权所有</text>
		</view>

		<!-- 注册弹窗 -->
		<uni-popup ref="registerPopup" type="center">
			<view class="register-popup">
				<view class="popup-header">
					<view class="popup-title">注册新账户</view>
					<view class="popup-close" @tap="closeRegisterPopup">
						<uni-icons type="close" size="20" color="#999"></uni-icons>
					</view>
				</view>

				<view class="popup-form">
					<view class="popup-input">
						<uni-icons type="person-filled" size="20" color="#00a57a"></uni-icons>
						<input type="text" v-model="registerForm.username" placeholder="用户名" />
					</view>
					<view class="popup-input">
						<uni-icons type="locked-filled" size="20" color="#00a57a"></uni-icons>
						<input type="password" v-model="registerForm.password" placeholder="密码" />
					</view>
					<view class="popup-input">
						<uni-icons type="contact-filled" size="20" color="#00a57a"></uni-icons>
						<input type="text" v-model="registerForm.nickname" placeholder="昵称" />
					</view>
					<view class="popup-input">
						<uni-icons type="phone-filled" size="20" color="#00a57a"></uni-icons>
						<input type="number" v-model="registerForm.phone" placeholder="手机号" maxlength="11" />
					</view>
					<view class="popup-input">
						<uni-icons type="email-filled" size="20" color="#00a57a"></uni-icons>
						<input type="email" v-model="registerForm.email" placeholder="邮箱" />
					</view>
				</view>

				<view class="popup-buttons">
					<button class="cancel-btn" @tap="closeRegisterPopup">取消</button>
					<button class="confirm-btn" :disabled="isRegistering" @tap="handleRegister">
						<text v-if="!isRegistering">注册</text>
						<view v-else class="loading-icon">
							<uni-icons type="spinner-cycle" size="18" color="#ffffff"></uni-icons>
						</view>
					</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import api from '@/api/index.js';
	
	export default {
		data() {
			return {
				loginForm: {
					username: '',
					password: ''
				},
				registerForm: {
					username: '',
					password: '',
					nickname: '',
					phone: '',
					email: ''
				},
				showPassword: false,
				isLoading: false,
				isRegistering: false,
				phoneInputFocus: false,
				passwordInputFocus: false
			}
		},
		computed: {
			// 计算密码强度
			passwordStrength() {
				const password = this.loginForm.password;
				if (!password) return 0;

				let score = 0;

				// 长度检查
				if (password.length >= 8) score += 1;
				if (password.length >= 12) score += 1;

				// 复杂度检查
				if (/[A-Z]/.test(password)) score += 1;
				if (/[a-z]/.test(password)) score += 1;
				if (/[0-9]/.test(password)) score += 1;
				if (/[^A-Za-z0-9]/.test(password)) score += 1;

				// 返回0-3的强度值
				return Math.min(3, Math.floor(score / 2));
			},

			// 密码强度对应的类名
			passwordStrengthClass() {
				const strengthClasses = ['weak', 'medium', 'strong', 'very-strong'];
				return strengthClasses[this.passwordStrength];
			},

			// 密码强度对应的文本
			passwordStrengthText() {
				const strengthTexts = ['弱', '中等', '强', '非常强'];
				return strengthTexts[this.passwordStrength];
			}
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},

			// 切换密码可见性
			togglePasswordVisibility() {
				this.showPassword = !this.showPassword;
			},

			// 忘记密码
			forgotPassword() {
				uni.showToast({
					title: '忘记密码功能开发中',
					icon: 'none'
				});
			},

			// 处理登录
			handleLogin() {
				// 表单验证
				if (!this.loginForm.username) {
					this.showErrorToast('请输入用户名');
					return;
				}

				if (!this.loginForm.password) {
					this.showErrorToast('请输入密码');
					return;
				}

				// 防止重复点击
				if (this.isLoading) return;
				this.isLoading = true;

				// 使用封装的API接口进行登录
				api.user.login(this.loginForm)
					.then(res => {
						console.log('登录响应:', res);
						if (res && res.code === 200) {
							// 登录成功，保存用户信息和token
							uni.setStorageSync('token', res.data.token);
							
							// 确保用户信息正确存储
							console.log('存储的用户信息:', res.data.userInfo);
							
							// 如果后端返回的是字符串，直接存储
							if (typeof res.data.userInfo === 'string') {
								uni.setStorageSync('userInfo', res.data.userInfo);
							} 
							// 如果后端返回的是对象，转为字符串后存储
							else if (typeof res.data.userInfo === 'object') {
								uni.setStorageSync('userInfo', JSON.stringify(res.data.userInfo));
							}
							// 如果后端没有返回用户信息，创建一个基本的用户信息对象
							else {
								const basicUserInfo = {
									username: this.loginForm.username,
									nickname: this.loginForm.username,
									avatar: '/static/logo.png'
								};
								uni.setStorageSync('userInfo', JSON.stringify(basicUserInfo));
								console.log('创建基本用户信息:', basicUserInfo);
							}

							uni.showToast({
								title: '登录成功',
								icon: 'success'
							});

							// 延迟跳转到首页
							setTimeout(() => {
								uni.switchTab({
									url: '/pages/index/index'
								});
							}, 1500);
						} else {
							// 登录失败
							this.showErrorToast(res?.msg || '登录失败，请检查用户名和密码');
						}
					})
					.catch(err => {
						console.error('登录请求失败:', err);
						this.showErrorToast(err.message || '网络错误，请稍后重试');
					})
					.finally(() => {
						this.isLoading = false;
					});
			},

			// 显示错误提示
			showErrorToast(message) {
				uni.showToast({
					title: message,
					icon: 'none',
					duration: 2000
				});
			},

			// 第三方登录
			thirdPartyLogin(type) {
				uni.showToast({
					title: `${type === 'qq' ? 'QQ' : '微信'}登录功能开发中`,
					icon: 'none'
				});
			},

			// 打开注册弹窗
			openRegisterPopup() {
				this.$refs.registerPopup.open();
			},

			// 关闭注册弹窗
			closeRegisterPopup() {
				this.$refs.registerPopup.close();
				// 清空注册表单
				this.registerForm = {
					username: '',
					password: '',
					nickname: '',
					phone: '',
					email: ''
				};
			},

			// 处理注册
			handleRegister() {
				// 表单验证
				if (!this.registerForm.username) {
					this.showErrorToast('请输入用户名');
					return;
				}

				if (!this.registerForm.password) {
					this.showErrorToast('请输入密码');
					return;
				}

				if (this.registerForm.password.length < 6) {
					this.showErrorToast('密码长度不能少于6位');
					return;
				}

				if (!this.registerForm.nickname) {
					this.showErrorToast('请输入昵称');
					return;
				}

				if (!this.registerForm.phone) {
					this.showErrorToast('请输入手机号');
					return;
				}

				if (this.registerForm.phone.length !== 11) {
					this.showErrorToast('请输入正确的手机号');
					return;
				}

				if (!this.registerForm.email) {
					this.showErrorToast('请输入邮箱');
					return;
				}

				// 简单的邮箱格式验证
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(this.registerForm.email)) {
					this.showErrorToast('请输入正确的邮箱格式');
					return;
				}

				// 防止重复点击
				if (this.isRegistering) return;
				this.isRegistering = true;
				
				// 准备注册数据
				const registerData = {
					username: this.registerForm.username,
					password: this.registerForm.password,
					nickname: this.registerForm.nickname,
					phone: this.registerForm.phone,
					email: this.registerForm.email
				};
				
				console.log('注册请求数据:', registerData);
				
				// 使用封装的API接口进行注册
				api.user.register(registerData)
					.then(res => {
						console.log('注册响应:', res);
						if (res && res.code === 200) {
							// 注册成功
							uni.showToast({
								title: '注册成功',
								icon: 'success'
							});

							// 关闭注册弹窗
							this.closeRegisterPopup();

							// 自动填充登录表单
							this.loginForm.username = this.registerForm.username;
							this.loginForm.password = this.registerForm.password;
						} else {
							// 注册失败
							const errorMsg = res?.msg || '注册失败，请稍后重试';
							this.showErrorToast(errorMsg);
							console.error('注册失败:', res);
						}
					})
					.catch(err => {
						console.error('注册请求失败:', err);
						this.showErrorToast(err.message || '网络错误，请稍后重试');
					})
					.finally(() => {
						this.isRegistering = false;
					});
			}
		}
	}
</script>

<style lang="scss">
	.login-container {
		min-height: 100vh;
		background-color: #f9f6f2; /* 米黄色背景，模拟宣纸质感 */
		padding: 40rpx;
		position: relative;
		display: flex;
		flex-direction: column;
		
		/* 背景装饰 */
		.background-decoration {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			overflow: hidden;
			z-index: 0;
			
			.bg-circle {
				position: absolute;
				border-radius: 50%;
				opacity: 0.8;
			}
			
			.circle-1 {
				width: 600rpx;
				height: 600rpx;
				top: -200rpx;
				right: -200rpx;
				background: linear-gradient(135deg, rgba(193, 154, 107, 0.15), rgba(193, 154, 107, 0.05));
				animation: float 15s infinite ease-in-out;
			}
			
			.circle-2 {
				width: 500rpx;
				height: 500rpx;
				bottom: -150rpx;
				left: -200rpx;
				background: linear-gradient(135deg, rgba(168, 95, 59, 0.1), rgba(168, 95, 59, 0.03));
				animation: float 18s infinite ease-in-out reverse;
			}
			
			.circle-3 {
				width: 300rpx;
				height: 300rpx;
				top: 40%;
				right: -100rpx;
				background: linear-gradient(135deg, rgba(0, 128, 85, 0.08), rgba(0, 128, 85, 0.02));
				animation: float 12s infinite ease-in-out;
			}
			
			.bg-pattern {
				position: absolute;
				width: 100%;
				height: 100%;
				opacity: 0.05;
				z-index: -1;
				/* 使用传统建筑纹理图案作为背景 */
			}
		}
		
		/* 返回按钮 */
		.back-btn {
			display: flex;
			align-items: center;
			font-size: 32rpx;
			color: #008055; /* 中国传统青绿色 */
			margin-bottom: 60rpx;
			z-index: 1;
			
			&:active {
				opacity: 0.7;
			}
			
			text {
				margin-left: 10rpx;
				font-weight: 500;
			}
		}
		
		/* 登录标题 */
		.login-header {
			margin-bottom: 80rpx;
			z-index: 1;
			animation: fadeInDown 0.8s ease-out;
			
			.login-title {
				font-size: 56rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 20rpx;
				letter-spacing: 4rpx;
				text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
				font-family: "FangSong", "仿宋", serif; /* 使用仿宋字体增强传统感 */
			}
			
			.login-subtitle {
				font-size: 28rpx;
				color: #666;
				letter-spacing: 2rpx;
			}
		}
		
		/* 登录表单 */
		.login-form {
			z-index: 1;
			animation: fadeInUp 0.8s ease-out;
			
			/* 输入框样式 */
			.input-item {
				display: flex;
				align-items: center;
				height: 100rpx;
				margin-bottom: 40rpx;
				transition: all 0.3s;
				position: relative;
				border-radius: 12rpx;
				background-color: rgba(255, 255, 255, 0.8);
				box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
				padding: 0 20rpx;
				border: 1px solid rgba(193, 154, 107, 0.2); /* 木色边框 */
				
				&.phone-item {
					&.input-focus {
						border-color: #008055;
						box-shadow: 0 4rpx 15rpx rgba(0, 128, 85, 0.15);
					}
				}
				
				&.password-item {
					&.input-focus {
						border-color: #008055;
						box-shadow: 0 4rpx 15rpx rgba(0, 128, 85, 0.15);
					}
					
					.password-toggle {
						width: 70rpx;
						height: 70rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 35rpx;
						transition: all 0.3s;
						
						&:active {
							background-color: rgba(0, 128, 85, 0.1);
						}
					}
					
					.password-strength {
						position: absolute;
						bottom: -30rpx;
						left: 20rpx;
						right: 20rpx;
						display: flex;
						align-items: center;
						animation: fadeIn 0.3s ease-out;
						
						.strength-bar {
							flex: 1;
							height: 6rpx;
							background-color: #eee;
							border-radius: 3rpx;
							overflow: hidden;
							margin-right: 10rpx;
							
							.strength-level {
								height: 100%;
								width: 0%;
								border-radius: 3rpx;
								transition: all 0.3s;
								
								&.weak {
									width: 25%;
									background-color: #e74c3c;
								}
								
								&.medium {
									width: 50%;
									background-color: #f39c12;
								}
								
								&.strong {
									width: 75%;
									background-color: #27ae60;
								}
								
								&.very-strong {
									width: 100%;
									background-color: #008055;
								}
							}
						}
						
						.strength-text {
							font-size: 22rpx;
							color: #999;
							width: 80rpx;
							text-align: right;
						}
					}
				}
				
				.input-icon {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 60rpx;
					height: 60rpx;
					margin-right: 20rpx;
					border-radius: 30rpx;
					background-color: rgba(0, 128, 85, 0.1);
				}
				
				input {
					flex: 1;
					height: 100%;
					font-size: 30rpx;
					color: #333;
					
					&::placeholder {
						color: #999;
						font-size: 28rpx;
					}
				}
				
				.input-clear {
					padding: 10rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
			
			/* 操作区域 */
			.action-area {
				display: flex;
				justify-content: space-between;
				margin-bottom: 60rpx;
				
				.register-link,
				.forgot-password {
					font-size: 26rpx;
					color: #008055;
					display: flex;
					align-items: center;
					
					&:active {
						opacity: 0.7;
					}
					
					uni-icons {
						margin-right: 6rpx;
					}
				}
			}
			
			/* 登录按钮 */
			.login-btn {
				height: 90rpx;
				line-height: 90rpx;
				background: linear-gradient(135deg, #008055, #00a878);
				color: #fff;
				font-size: 32rpx;
				border-radius: 45rpx;
				margin-bottom: 80rpx;
				box-shadow: 0 10rpx 20rpx rgba(0, 128, 85, 0.2);
				transition: all 0.3s;
				display: flex;
				justify-content: center;
				align-items: center;
				letter-spacing: 4rpx;
				position: relative;
				overflow: hidden;
				font-weight: 500;
				
				&::after {
					content: '';
					position: absolute;
					top: 0;
					left: -100%;
					width: 100%;
					height: 100%;
					background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
					transition: all 0.5s;
				}
				
				&:active {
					transform: scale(0.98);
					box-shadow: 0 5rpx 10rpx rgba(0, 128, 85, 0.2);
					
					&::after {
						left: 100%;
					}
				}
				
				&:disabled {
					opacity: 0.7;
				}
				
				.loading-icon {
					animation: spin 1s linear infinite;
				}
			}
			
			/* 第三方登录 */
			.third-party-login {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 60rpx;
				
				.divider {
					flex: 1;
					height: 1px;
					background-color: rgba(193, 154, 107, 0.3); /* 木色分割线 */
				}
				
				text {
					padding: 0 30rpx;
					font-size: 28rpx;
					color: #999;
				}
			}
			
			/* 第三方登录图标 */
			.third-party-icons {
				display: flex;
				justify-content: center;
				
				.icon-item {
					width: 90rpx;
					height: 90rpx;
					margin: 0 40rpx;
					background-color: #fff;
					border-radius: 50%;
					box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.1);
					display: flex;
					justify-content: center;
					align-items: center;
					transition: all 0.3s;
					border: 1px solid rgba(193, 154, 107, 0.2); /* 木色边框 */
					
					&:active {
						transform: scale(0.95);
						box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
					}
					
					image {
						width: 60%;
						height: 60%;
						border-radius: 50%;
					}
				}
			}
		}
		
		/* 底部版权信息 */
		.footer {
			margin-top: auto;
			text-align: center;
			padding: 30rpx 0;
			font-size: 24rpx;
			color: #999;
			z-index: 1;
		}
	}
	
	/* 注册弹窗样式 */
	.register-popup {
		width: 600rpx;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 40rpx;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
		animation: scaleIn 0.3s ease-out;
		border: 1px solid rgba(193, 154, 107, 0.2); /* 木色边框 */
		
		.popup-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 40rpx;
			
			.popup-title {
				font-size: 36rpx;
				font-weight: bold;
				color: #333;
				letter-spacing: 2rpx;
				font-family: "FangSong", "仿宋", serif; /* 使用仿宋字体增强传统感 */
			}
			
			.popup-close {
				padding: 10rpx;
				border-radius: 50%;
				transition: all 0.3s;
				
				&:active {
					background-color: #f5f5f5;
				}
			}
		}
		
		.popup-form {
			.popup-input {
				height: 90rpx;
				border-bottom: 1px solid rgba(193, 154, 107, 0.3); /* 木色边框 */
				margin-bottom: 30rpx;
				display: flex;
				align-items: center;
				padding: 0 10rpx;
				position: relative;
				transition: all 0.3s;
				
				uni-icons {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 50rpx;
					height: 50rpx;
					margin-right: 20rpx;
					border-radius: 25rpx;
					background-color: rgba(0, 128, 85, 0.1);
				}
				
				input {
					flex: 1;
					height: 100%;
					font-size: 28rpx;
					color: #333;
					
					&::placeholder {
						color: #999;
						font-size: 26rpx;
					}
				}
				
				&:focus-within {
					border-bottom-color: #008055;
					background-color: rgba(0, 128, 85, 0.03);
					border-radius: 8rpx 8rpx 0 0;
				}
				
				&::after {
					content: '';
					position: absolute;
					bottom: -1px;
					left: 0;
					width: 0;
					height: 2px;
					background: linear-gradient(90deg, #008055, #00a878);
					transition: all 0.3s ease;
				}
				
				&:focus-within::after {
					width: 100%;
				}
			}
		}
		
		.popup-buttons {
			display: flex;
			justify-content: space-between;
			margin-top: 40rpx;
			
			button {
				width: 45%;
				height: 80rpx;
				line-height: 80rpx;
				font-size: 30rpx;
				border-radius: 40rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				transition: all 0.3s;
			}
			
			.cancel-btn {
				background-color: #f5f5f5;
				color: #666;
				border: 1px solid rgba(193, 154, 107, 0.2); /* 木色边框 */
				
				&:active {
					background-color: #e9e9e9;
					transform: scale(0.98);
				}
			}
			
			.confirm-btn {
				background: linear-gradient(135deg, #008055, #00a878);
				color: #fff;
				box-shadow: 0 5rpx 15rpx rgba(0, 128, 85, 0.2);
				
				&:active {
					opacity: 0.9;
					transform: scale(0.98);
					box-shadow: 0 2rpx 8rpx rgba(0, 128, 85, 0.2);
				}
				
				&:disabled {
					opacity: 0.7;
				}
				
				.loading-icon {
					animation: spin 1s linear infinite;
				}
			}
		}
	}
	
	/* 动画效果 */
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		
		100% {
			transform: rotate(360deg);
		}
	}
	
	@keyframes float {
		0%, 100% {
			transform: translateY(0);
		}
		
		50% {
			transform: translateY(-20rpx);
		}
	}
	
	@keyframes fadeInDown {
		from {
			opacity: 0;
			transform: translateY(-30rpx);
		}
		
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30rpx);
		}
		
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	@keyframes scaleIn {
		from {
			opacity: 0;
			transform: scale(0.9);
		}
		
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		
		to {
			opacity: 1;
		}
	}
</style>