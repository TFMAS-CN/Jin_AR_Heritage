<template>
	<view class="mall-container">
		<!-- 顶部背景区域 -->
		<view class="header-bg">
			<image class="bg-image" src="/static/subscribe/4.jpg" mode="aspectFill"></image>
			<view class="overlay"></view>
			<view class="title">晋味山西</view>
			
			<!-- 搜索框 -->
			<view class="search-box">
				<uni-icons type="search" size="18" color="#999"></uni-icons>
				<input type="text" placeholder="搜索" />
			</view>
		</view>
		
		<!-- 功能分类区 -->
		<view class="category-section">
			<view class="category-item" v-for="(item, index) in categories" :key="index" @tap="navigateToCategory(item.id)">
				<image :src="item.icon" mode="aspectFit"></image>
				<text>{{ item.name }}</text>
			</view>
		</view>
		
		<!-- 推荐商品区 -->
		<view class="recommend-section">
			<view class="section-title">
				<text>热门推荐</text>
				<view class="more" @tap="navigateToMore('hot')">更多 <uni-icons type="right" size="14" color="#999"></uni-icons></view>
			</view>
			
			<view class="product-list">
				<view class="product-item" v-for="(item, index) in hotProducts" :key="index" @tap="navigateToDetail(item.id)">
					<image :src="item.image" mode="aspectFill"></image>
					<view class="product-info">
						<view class="product-name">{{ item.name }}</view>
						<view class="product-price">¥{{ item.price }}</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 特色商品区 -->
		<view class="feature-section">
			<view class="section-title">
				<text>特色商品</text>
				<view class="more" @tap="navigateToMore('feature')">更多 <uni-icons type="right" size="14" color="#999"></uni-icons></view>
			</view>
			
			<view class="feature-list">
				<view class="feature-item" v-for="(item, index) in featureProducts" :key="index" @tap="navigateToDetail(item.id)">
					<image :src="item.image" mode="aspectFill"></image>
					<view class="feature-info">
						<view class="feature-name">{{ item.name }}</view>
						<view class="feature-desc">{{ item.desc }}</view>
						<view class="feature-price">¥{{ item.price }}</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 新品上架 -->
		<view class="new-section">
			<view class="section-title">
				<text>新品上架</text>
				<view class="more" @tap="navigateToMore('new')">更多 <uni-icons type="right" size="14" color="#999"></uni-icons></view>
			</view>
			
			<view class="new-list">
				<view class="new-item" v-for="(item, index) in newProducts" :key="index" @tap="navigateToDetail(item.id)">
					<image :src="item.image" mode="aspectFill"></image>
					<view class="new-tag">新品</view>
					<view class="new-info">
						<view class="new-name">{{ item.name }}</view>
						<view class="new-price">¥{{ item.price }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				categories: [
					{
						id: 1,
						name: '趣味文创',
						icon: '/static/mall/category-1.png'
					},
					{
						id: 2,
						name: '特产美食',
						icon: '/static/mall/category-2.png'
					},
					{
						id: 3,
						name: '特色非遗',
						icon: '/static/mall/category-3.png'
					}
				],
				hotProducts: [
					{
						id: 101,
						name: '晋祠文创杯',
						price: 39.9,
						image: '/static/mall/product-1.jpg'
					},
					{
						id: 102,
						name: '山西老陈醋',
						price: 29.9,
						image: '/static/mall/product-2.jpg'
					},
					{
						id: 103,
						name: '手工剪纸',
						price: 19.9,
						image: '/static/mall/product-3.jpg'
					},
					{
						id: 104,
						name: '太谷饼',
						price: 25.8,
						image: '/static/mall/product-4.jpg'
					}
				],
				featureProducts: [
					{
						id: 201,
						name: '晋祠纪念套装',
						desc: '含晋祠微缩模型、明信片等',
						price: 99.0,
						image: '/static/mall/feature-1.jpg'
					},
					{
						id: 202,
						name: '山西特色小吃礼盒',
						desc: '囊括山西特色美食',
						price: 128.0,
						image: '/static/mall/feature-2.jpg'
					}
				],
				newProducts: [
					{
						id: 301,
						name: '晋祠文创T恤',
						price: 89.0,
						image: '/static/mall/new-1.jpg'
					},
					{
						id: 302,
						name: '山西民间工艺品',
						price: 159.0,
						image: '/static/mall/new-2.jpg'
					},
					{
						id: 303,
						name: '晋祠AR互动书',
						price: 49.9,
						image: '/static/mall/new-3.jpg'
					}
				]
			};
		},
		methods: {
			navigateToCategory(id) {
				uni.navigateTo({
					url: `/pages/mall/category?id=${id}`
				});
			},
			navigateToDetail(id) {
				uni.navigateTo({
					url: `/pages/mall/detail?id=${id}`
				});
			},
			navigateToMore(type) {
				uni.navigateTo({
					url: `/pages/mall/list?type=${type}`
				});
			}
		}
	}
</script>

<style lang="scss">
	.mall-container {
		background-color: #f5f6fa;
		min-height: 100vh;
		
		.header-bg {
			position: relative;
			height: 400rpx;
			overflow: hidden;
			
			.bg-image {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
			
			.overlay {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4));
			}
			
			.title {
				position: absolute;
				top: 80rpx;
				left: 0;
				right: 0;
				text-align: center;
				font-size: 48rpx;
				color: #fff;
				font-weight: bold;
				text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
				font-family: "FangSong", "STFangsong", serif;
			}
			
			.search-box {
				position: absolute;
				bottom: 30rpx;
				left: 30rpx;
				right: 30rpx;
				height: 80rpx;
				background-color: rgba(255, 255, 255, 0.9);
				border-radius: 40rpx;
				display: flex;
				align-items: center;
				padding: 0 30rpx;
				box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
				
				uni-icons {
					margin-right: 20rpx;
				}
				
				input {
					flex: 1;
					height: 80rpx;
					font-size: 28rpx;
				}
			}
		}
		
		.category-section {
			display: flex;
			justify-content: space-around;
			padding: 40rpx 20rpx;
			background-color: #fff;
			margin: 20rpx;
			border-radius: 20rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
			
			.category-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 33.33%;
				
				image {
					width: 120rpx;
					height: 120rpx;
					margin-bottom: 16rpx;
				}
				
				text {
					font-size: 26rpx;
					color: #333;
				}
			}
		}
		
		.section-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 30rpx;
			
			text {
				font-size: 32rpx;
				font-weight: 600;
				color: #333;
				position: relative;
				padding-left: 20rpx;
				
				&::before {
					content: '';
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					width: 8rpx;
					height: 32rpx;
					background: linear-gradient(to bottom, #4a90e2, #57b6e9);
					border-radius: 4rpx;
				}
			}
			
			.more {
				font-size: 24rpx;
				color: #999;
				display: flex;
				align-items: center;
			}
		}
		
		.recommend-section {
			background-color: #fff;
			margin: 20rpx;
			border-radius: 20rpx;
			padding-bottom: 30rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
			
			.product-list {
				display: flex;
				flex-wrap: wrap;
				padding: 0 20rpx;
				
				.product-item {
					width: calc(50% - 20rpx);
					margin: 10rpx;
					background-color: #f9f9f9;
					border-radius: 16rpx;
					overflow: hidden;
					box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
					
					image {
						width: 100%;
						height: 240rpx;
						object-fit: cover;
					}
					
					.product-info {
						padding: 16rpx;
						
						.product-name {
							font-size: 26rpx;
							color: #333;
							margin-bottom: 8rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
						
						.product-price {
							font-size: 28rpx;
							color: #e74c3c;
							font-weight: 600;
						}
					}
				}
			}
		}
		
		.feature-section {
			background-color: #fff;
			margin: 20rpx;
			border-radius: 20rpx;
			padding-bottom: 30rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
			
			.feature-list {
				padding: 0 20rpx;
				
				.feature-item {
					display: flex;
					background-color: #f9f9f9;
					border-radius: 16rpx;
					margin-bottom: 20rpx;
					overflow: hidden;
					box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
					
					image {
						width: 240rpx;
						height: 180rpx;
						object-fit: cover;
					}
					
					.feature-info {
						flex: 1;
						padding: 20rpx;
						
						.feature-name {
							font-size: 28rpx;
							font-weight: 600;
							color: #333;
							margin-bottom: 10rpx;
						}
						
						.feature-desc {
							font-size: 24rpx;
							color: #666;
							margin-bottom: 20rpx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}
						
						.feature-price {
							font-size: 30rpx;
							color: #e74c3c;
							font-weight: 600;
						}
					}
				}
			}
		}
		
		.new-section {
			background-color: #fff;
			margin: 20rpx;
			border-radius: 20rpx;
			padding-bottom: 30rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
			
			.new-list {
				display: flex;
				padding: 0 10rpx;
				overflow-x: auto;
				
				&::-webkit-scrollbar {
					display: none;
				}
				
				.new-item {
					position: relative;
					width: 220rpx;
					flex-shrink: 0;
					margin: 0 10rpx;
					border-radius: 16rpx;
					overflow: hidden;
					background-color: #f9f9f9;
					box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
					
					image {
						width: 100%;
						height: 220rpx;
						object-fit: cover;
					}
					
					.new-tag {
						position: absolute;
						top: 10rpx;
						right: 10rpx;
						background: linear-gradient(135deg, #ff9800, #ff5722);
						color: #fff;
						font-size: 20rpx;
						padding: 4rpx 12rpx;
						border-radius: 20rpx;
					}
					
					.new-info {
						padding: 16rpx;
						
						.new-name {
							font-size: 24rpx;
							color: #333;
							margin-bottom: 8rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
						
						.new-price {
							font-size: 26rpx;
							color: #e74c3c;
							font-weight: 600;
						}
					}
				}
			}
		}
	}
</style>
