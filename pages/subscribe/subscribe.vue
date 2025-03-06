<template>
	<view class="subscribe">
		<!-- 背景图 -->
		<view class="backdrop">
			<view class="backdrop-overlay"></view>
		</view>
		<!-- 用户信息 -->
		<view class="user">
			<view class="avatar-container">
				<view class="avatar">
					<image :src="userInfo && userInfo.avatar ? userInfo.avatar : '/static/logo.png'" mode="aspectFill">
					</image>
				</view>
				<view class="avatar-border"></view>
			</view>
			<view class="content">
				<view class="name">{{ userInfo ? userInfo.nickname || userInfo.username : '游客' }}</view>
				<view class="login-tip" v-if="!userInfo" @tap="goToLogin">
					<text>点击登录账号</text>
					<uni-icons type="right" size="14" color="#4a90e2"></uni-icons>
				</view>
				<view class="vip" v-if="userInfo">
					<view class="badge level">
						<image src="/static/forum/Grade/LV13.png" mode="aspectFit"></image>
					</view>
					<view class="badge member">
						<image src="/static/forum/会员亮.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
			<button class="button" @tap="createPost">
				<text>发帖</text>
				<uni-icons type="plus" size="16" color="#FFFFFF"></uni-icons>
			</button>
		</view>

		<!-- 论坛信息 -->
		<view class="forum">
			<!-- 分类标签 -->
			<view class="categories">
				<view v-for="(category, index) in categories" :key="index"
					:class="['category', activeCategory === category ? 'active' : '']" @tap="changeCategory(category)">
					{{ category }}
				</view>
			</view>

			<!-- 帖子列表 -->
			<view class="posts">
				<view class="post-item" v-for="(item, index) in postList" :key="index">
					<view class="post-header">
						<view class="post-user">
							<image class="post-avatar" :src="item.avatar || '/static/logo.png'" mode="aspectFill">
							</image>
							<view class="post-info">
								<view class="post-username">{{ item.username || '文化爱好者' }}</view>
								<view class="post-time">{{ item.time || '2小时前' }}</view>
							</view>
						</view>
						<view class="post-tag">{{ item.category || '景点攻略' }}</view>
					</view>

					<view class="post-content">
						<view class="post-title">{{ item.title || '晋祠游览攻略，千年古建筑的魅力所在' }}</view>
						<view class="post-text">
							{{ item.content || '晋祠是中国现存最早的皇家园林，始建于北魏，距今已有1400多年历史。这里有着众多国宝级文物和建筑，如难老泉、侍女像、圣母像等，值得细细品味...' }}
						</view>
					</view>

					<view class="post-images" v-if="item.images && item.images.length">
						<image v-for="(img, imgIndex) in item.images.slice(0, 3)" :key="imgIndex" :src="img"
							mode="aspectFill"></image>
					</view>

					<view class="post-footer">
						<view class="action" @tap="likePost(item)">
							<uni-icons :type="item.isLiked ? 'heart-filled' : 'heart'" size="18"
								:color="item.isLiked ? '#4a90e2' : '#666'"></uni-icons>
							<text :style="{ color: item.isLiked ? '#4a90e2' : '#666' }">{{ item.likes || 128 }}</text>
						</view>
						<view class="action" @tap="commentPost(item)">
							<uni-icons type="chat" size="18" color="#666"></uni-icons>
							<text>{{ item.comments || 36 }}</text>
						</view>
						<view class="action" @tap="favoritePost(item)">
							<uni-icons :type="item.isFavorited ? 'star-filled' : 'star'" size="18"
								:color="item.isFavorited ? '#4a90e2' : '#666'"></uni-icons>
							<text :style="{ color: item.isFavorited ? '#4a90e2' : '#666' }">收藏</text>
						</view>
						<view class="action" @tap="sharePost(item)">
							<uni-icons type="forward" size="18" color="#666"></uni-icons>
							<text>分享</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 加载更多 -->
			<view class="load-more" @tap="loadMorePosts">
				<text>{{ isLoading ? '加载中...' : '上拉加载更多' }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				categories: ['全部', '景点攻略', '文物鉴赏', '旅行分享', 'AR体验'],
				activeCategory: '全部',
				postList: [],
				isLoading: false,
				page: 1,
				pageSize: 5,
				userInfo: null // 添加用户信息
			};
		},
		onLoad() {
			// 获取用户信息
			this.getUserInfo();
			// 调试本地存储
			this.debugLocalStorage();
			// 模拟获取帖子数据
			this.loadPosts();
		},
		// 页面显示时刷新用户信息
		onShow() {
			// 重新获取用户信息，以防用户在其他页面登录或修改了信息
			this.getUserInfo();
			// 调试本地存储
			this.debugLocalStorage();

			// 检查是否从登录页返回
			const pages = getCurrentPages();
			const currentPage = pages[pages.length - 1];
			if (currentPage && currentPage.route.includes('subscribe')) {
				// 延迟一下再次获取用户信息，确保登录后的数据已经保存到本地存储
				setTimeout(() => {
					this.getUserInfo();
					this.debugLocalStorage();
				}, 500);
			}
		},
		methods: {
			// 获取用户信息
			getUserInfo() {
				try {
					const userInfoStr = uni.getStorageSync('userInfo');
					if (userInfoStr) {
						this.userInfo = JSON.parse(userInfoStr);
						// console.log('获取到用户信息:', this.userInfo);
					} else {
						// console.log('未找到用户信息，可能未登录');

						// 尝试从token获取用户信息
						this.getUserInfoFromToken();
					}
				} catch (e) {
					// console.error('获取用户信息失败:', e);

					// 尝试从token获取用户信息
					this.getUserInfoFromToken();
				}
			},

			// 从token获取用户信息
			getUserInfoFromToken() {
				const token = uni.getStorageSync('token');
				if (token) {
					// console.log('尝试从token获取用户信息');

					// 创建一个基本的用户信息
					const basicUserInfo = {
						username: '用户' + token.substring(0, 6),
						nickname: '用户' + token.substring(0, 6),
						avatar: '/static/logo.png'
					};

					// 保存到本地存储和当前状态
					uni.setStorageSync('userInfo', JSON.stringify(basicUserInfo));
					this.userInfo = basicUserInfo;

					// console.log('从token创建的基本用户信息:', basicUserInfo);
				}
			},

			// 检查登录状态
			checkLogin() {
				if (!this.userInfo) {
					uni.showModal({
						title: '提示',
						content: '您尚未登录，是否前往登录页面？',
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/login/login'
								});
							}
						}
					});
					return false;
				}
				return true;
			},

			// 创建帖子前检查登录状态
			createPost() {
				if (this.checkLogin()) {
					// 跳转到发帖页面
					uni.navigateTo({
						url: '/pages/post/create'
					});
				}
			},

			// 点赞前检查登录状态
			likePost(post) {
				if (!this.checkLogin()) return;

				// 实现点赞逻辑
				post.isLiked = !post.isLiked;
				if (post.isLiked) {
					post.likes++;
				} else {
					post.likes--;
				}
				// 实际应用中应该调用API更新点赞状态
				// console.log('点赞帖子:', post.id, '点赞状态:', post.isLiked);
			},

			// 评论前检查登录状态
			commentPost(post) {
				if (!this.checkLogin()) return;

				// 实现评论帖子逻辑
				uni.navigateTo({
					url: `/pages/post/detail?id=${post.id}&tab=comment`
				});
				// console.log('评论帖子:', post.id);
			},

			// 收藏前检查登录状态
			favoritePost(post) {
				if (!this.checkLogin()) return;

				// 实现收藏帖子逻辑
				post.isFavorited = !post.isFavorited;
				// 实际应用中应该调用API更新收藏状态
				console.log('收藏帖子:', post.id, '收藏状态:', post.isFavorited);
			},

			// 分享前检查登录状态
			sharePost(post) {
				if (!this.checkLogin()) return;

				// 实现分享帖子逻辑
				uni.share({
					provider: 'weixin',
					scene: 'WXSceneSession',
					type: 0,
					title: post.title,
					summary: post.content,
					imageUrl: post.images && post.images.length > 0 ? post.images[0] : '',
					success: function(res) {
						console.log('分享成功:', res);
					},
					fail: function(err) {
						console.log('分享失败:', err);
					}
				});
				console.log('分享帖子:', post.id);
			},

			loadPosts() {
				// 模拟获取帖子数据
				this.isLoading = true;

				// 模拟网络请求延迟
				setTimeout(() => {
					// 模拟不同分类的帖子数据
					const mockPosts = [{
							id: 1,
							username: '晋祠文化爱好者',
							avatar: '/static/logo.png',
							time: '2小时前',
							category: '景点攻略',
							title: '晋祠游览攻略，千年古建筑的魅力所在',
							content: '晋祠是中国现存最早的皇家园林，始建于北魏，距今已有1400多年历史。这里有着众多国宝级文物和建筑，如难老泉、侍女像、圣母像等，值得细细品味...',
							images: ['/static/subscribe/1.jpg', '/static/subscribe/1.jpg',
								'/static/subscribe/1.jpg'
							],
							likes: 128,
							comments: 36,
							isLiked: false,
							isFavorited: false
						},
						{
							id: 2,
							username: '文物研究员',
							avatar: '/static/logo.png',
							time: '昨天',
							category: '文物鉴赏',
							title: '晋祠圣母像：宋代彩塑艺术的巅峰之作',
							content: '晋祠圣母像是中国宋代彩塑艺术的代表作品，其精湛的工艺和生动的表现力，展现了宋代工匠的高超技艺。圣母像神态庄重，衣纹流畅，是研究宋代雕塑艺术的重要实物资料...',
							images: ['/static/subscribe/1.jpg', '/static/subscribe/1.jpg'],
							likes: 95,
							comments: 28,
							isLiked: false,
							isFavorited: false
						},
						{
							id: 3,
							username: 'AR技术爱好者',
							avatar: '/static/logo.png',
							time: '3天前',
							category: 'AR体验',
							title: '晋祠AR导览体验：科技与文化的完美结合',
							content: '今天体验了晋祠的AR导览功能，通过手机就能看到各个建筑的历史变迁和文物复原效果，非常震撼！特别是难老泉和侍女像的AR展示，让人仿佛穿越回宋代...',
							images: ['/static/subscribe/1.jpg', '/static/subscribe/1.jpg',
								'/static/subscribe/1.jpg'
							],
							likes: 156,
							comments: 42,
							isLiked: false,
							isFavorited: false
						},
						{
							id: 4,
							username: '旅行达人',
							avatar: '/static/logo.png',
							time: '上周',
							category: '旅行分享',
							title: '晋祠一日游：最佳路线规划与美食推荐',
							content: '分享一下我的晋祠一日游攻略，包括交通、门票、最佳游览路线以及周边美食推荐。建议上午先游览难老泉和水镜台，下午参观圣母殿和侍女像，傍晚可以去周边品尝太原特色美食...',
							images: ['/static/subscribe/1.jpg'],
							likes: 87,
							comments: 23,
							isLiked: false,
							isFavorited: false
						},
						{
							id: 5,
							username: '历史研究者',
							avatar: '/static/logo.png',
							time: '上个月',
							category: '文物鉴赏',
							title: '晋祠建筑群的历史沿革与文化价值',
							content: '晋祠始建于北魏，历经唐宋元明清多次修缮扩建，形成了现在的规模。其中宋代遗存最为珍贵，如宋代的献殿、圣母殿、鱼沼飞梁等，都是中国古代建筑史上的重要实例...',
							images: ['/static/subscribe/1.jpg', '/static/subscribe/1.jpg'],
							likes: 112,
							comments: 31,
							isLiked: false,
							isFavorited: false
						}
					];

					// 根据分类筛选帖子
					let filteredPosts = [];
					if (this.activeCategory === '全部') {
						filteredPosts = mockPosts;
					} else {
						filteredPosts = mockPosts.filter(post => post.category === this.activeCategory);
					}

					// 首次加载或切换分类时替换数据，加载更多时追加数据
					if (this.page === 1) {
						this.postList = filteredPosts;
					} else {
						this.postList = [...this.postList, ...filteredPosts];
					}

					this.isLoading = false;
				}, 500);
			},
			changeCategory(category) {
				if (this.activeCategory === category) return;

				this.activeCategory = category;
				this.page = 1; // 重置页码
				// 根据分类重新加载帖子
				this.loadPosts();
			},
			loadMorePosts() {
				if (this.isLoading) return;

				this.page++;
				this.loadPosts();
			},
			// 调试本地存储
			debugLocalStorage() {
				const token = uni.getStorageSync('token');
				const userInfoStr = uni.getStorageSync('userInfo');

				// console.log('===== 调试本地存储 =====');
				// console.log('token:', token);
				// console.log('userInfoStr:', userInfoStr);

				if (userInfoStr) {
					try {
						const parsedUserInfo = JSON.parse(userInfoStr);
						// console.log('解析后的用户信息:', parsedUserInfo);
					} catch (e) {
						// console.error('解析用户信息失败:', e);
					}
				}
				// console.log('========================');
			},

			// 跳转到登录页面
			goToLogin() {
				// 显示登录对话框
				uni.showModal({
					title: '快速登录',
					content: '您可以选择直接登录或前往登录页面',
					confirmText: '直接登录',
					cancelText: '前往登录页',
					success: (res) => {
						if (res.confirm) {
							// 直接登录
							this.quickLogin();
						} else {
							// 前往登录页
							uni.navigateTo({
								url: '/pages/login/login'
							});
						}
					}
				});
			},

			// 快速登录
			quickLogin() {
				// 显示加载中
				uni.showLoading({
					title: '登录中...'
				});

				// 使用默认账号登录
				const loginData = {
					username: 'zhangsan',
					password: '123456'
				};

				// 模拟登录请求
				setTimeout(() => {
					// 隐藏加载中
					uni.hideLoading();

					// 创建token和用户信息
					const token = 'mock_token_' + Date.now();
					const userInfo = {
						username: loginData.username,
						nickname: '张三',
						avatar: '/static/logo.png'
					};

					// 保存到本地存储
					uni.setStorageSync('token', token);
					uni.setStorageSync('userInfo', JSON.stringify(userInfo));

					// 更新当前状态
					this.userInfo = userInfo;

					// 显示登录成功
					uni.showToast({
						title: '登录成功',
						icon: 'success'
					});

					// 刷新页面
					this.getUserInfo();
					this.debugLocalStorage();
				}, 1000);
			},
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.page = 1;
			this.loadPosts();
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		// 上拉加载更多
		onReachBottom() {
			this.loadMorePosts();
		}
	}
</script>

<style lang="scss">
	.subscribe {
		background-color: #f5f6fa;
		min-height: 100vh;

		.backdrop {
			width: 100%;
			height: 400rpx;
			background-image: url('/static/subscribe/1.jpg');
			background-size: cover;
			background-position: center;
			position: relative;

			&-overlay {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5));
			}
		}

		.user {
			margin: 0 30rpx;
			margin-top: -120rpx;
			display: flex;
			align-items: center;
			position: relative;
			z-index: 10;
			background: rgba(255, 255, 255, 0.9);
			backdrop-filter: blur(10px);
			border-radius: 24rpx;
			padding: 24rpx 30rpx;
			box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);

			.avatar-container {
				position: relative;
				width: 130rpx;
				height: 130rpx;

				.avatar {
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
					overflow: hidden;
					border: 4rpx solid #fff;
					box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
					position: absolute;
					top: 5rpx;
					left: 5rpx;
					z-index: 2;

					image {
						width: 100%;
						height: 100%;
						object-fit: cover;
					}
				}

				.avatar-border {
					position: absolute;
					top: 0;
					left: 0;
					width: 130rpx;
					height: 130rpx;
					border-radius: 50%;
					background: linear-gradient(135deg, #4a90e2, #57b6e9, #4a90e2);
					z-index: 1;
					animation: rotate 8s linear infinite;
				}

				@keyframes rotate {
					from {
						transform: rotate(0deg);
					}

					to {
						transform: rotate(360deg);
					}
				}
			}

			.content {
				margin-left: 24rpx;
				flex: 1;

				.name {
					font-size: 36rpx;
					font-weight: 600;
					color: #333;
					margin-bottom: 12rpx;
				}

				.login-tip {
					display: flex;
					align-items: center;
					font-size: 26rpx;
					color: #4a90e2;
					margin-top: 8rpx;

					text {
						margin-right: 4rpx;
					}

					&:active {
						opacity: 0.8;
					}
				}

				.vip {
					display: flex;
					align-items: center;
					height: 50rpx;

					.badge {
						display: flex;
						align-items: center;
						justify-content: center;
						margin-right: 16rpx;
						border-radius: 8rpx;
						overflow: hidden;

						&.level {
							background: linear-gradient(135deg, #ffb74d, #ff9800);
							padding: 2rpx 4rpx;

							image {
								width: 70rpx;
								height: 40rpx;
							}
						}

						&.member {
							background: linear-gradient(135deg, #4a90e2, #57b6e9);
							padding: 2rpx 4rpx;

							image {
								width: 70rpx;
								height: 40rpx;
							}
						}
					}
				}
			}

			.button {
				min-width: 160rpx;
				height: 70rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 35rpx;
				background: linear-gradient(135deg, #4a90e2, #57b6e9);
				color: #FFFFFF;
				font-size: 28rpx;
				font-weight: 500;
				box-shadow: 0 4rpx 12rpx rgba(74, 144, 226, 0.3);
				padding: 0 24rpx;
				transition: all 0.3s ease;

				text {
					margin-right: 8rpx;
				}

				&:active {
					transform: scale(0.95);
					box-shadow: 0 2rpx 8rpx rgba(74, 144, 226, 0.2);
				}
			}
		}

		.forum {
			margin-top: 40rpx;
			padding: 0 20rpx;

			.categories {
				display: flex;
				overflow-x: auto;
				padding: 10rpx 0;
				margin-bottom: 30rpx;

				&::-webkit-scrollbar {
					display: none;
				}

				.category {
					padding: 12rpx 30rpx;
					background-color: #f0f2f5;
					border-radius: 30rpx;
					margin-right: 20rpx;
					font-size: 26rpx;
					color: #666;
					white-space: nowrap;
					transition: all 0.3s ease;

					&.active {
						background: linear-gradient(135deg, #4a90e2, #57b6e9);
						color: #fff;
						font-weight: 500;
						box-shadow: 0 4rpx 12rpx rgba(74, 144, 226, 0.2);
					}

					&:active {
						transform: scale(0.95);
					}
				}
			}

			.posts {
				.post-item {
					background-color: #fff;
					border-radius: 20rpx;
					padding: 30rpx;
					margin-bottom: 30rpx;
					box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);

					.post-header {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 20rpx;

						.post-user {
							display: flex;
							align-items: center;

							.post-avatar {
								width: 80rpx;
								height: 80rpx;
								border-radius: 50%;
								margin-right: 16rpx;
							}

							.post-info {
								.post-username {
									font-size: 28rpx;
									font-weight: 500;
									color: #333;
								}

								.post-time {
									font-size: 22rpx;
									color: #999;
									margin-top: 4rpx;
								}
							}
						}

						.post-tag {
							font-size: 22rpx;
							color: #4a90e2;
							background-color: rgba(74, 144, 226, 0.1);
							padding: 6rpx 16rpx;
							border-radius: 20rpx;
						}
					}

					.post-content {
						margin-bottom: 20rpx;

						.post-title {
							font-size: 32rpx;
							font-weight: 600;
							color: #333;
							margin-bottom: 16rpx;
							line-height: 1.4;
						}

						.post-text {
							font-size: 26rpx;
							color: #666;
							line-height: 1.6;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 3;
							overflow: hidden;
						}
					}

					.post-images {
						display: flex;
						margin-bottom: 20rpx;

						image {
							width: 210rpx;
							height: 160rpx;
							border-radius: 12rpx;
							margin-right: 10rpx;
							object-fit: cover;

							&:last-child {
								margin-right: 0;
							}
						}
					}

					.post-footer {
						display: flex;
						justify-content: space-between;
						border-top: 2rpx solid #f0f2f5;
						padding-top: 20rpx;

						.action {
							display: flex;
							align-items: center;
							font-size: 24rpx;
							color: #666;

							uni-icons {
								margin-right: 6rpx;
							}
						}
					}
				}
			}

			.load-more {
				text-align: center;
				padding: 30rpx 0;
				color: #999;
				font-size: 26rpx;
			}
		}
	}
</style>