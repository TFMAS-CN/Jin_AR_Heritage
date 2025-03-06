<template>
	<view>
		<view class="nav">
			<view class="ul">
				<view class="li" :class="active == 1 ? 'active':''" @click="activeBtn(1)">
					<image src="/static/taber/文物资源.png"></image>
					<text>首页</text>
				</view>
				<view class="li" :class="active == 2 ? 'active':''" @click="activeBtn(2)">
					<image src="/static/taber/预约 (1).png"></image>
					<text>预约</text>
				</view>
				<view class="li" :class="active == 3 ? 'active':''" @click="activeBtn(3)">
					<image src="/static/taber/AR扫一扫-选中.png"></image>
					<text>AR</text>
				</view>
				<view class="li" :class="active == 4 ? 'active':''" @click="activeBtn(4)">
					<image src="/static/taber/购物-选中.png"></image>
					<text>商城</text>
				</view>
				<view class="li" :class="active == 5 ? 'active':''" @click="activeBtn(5)">
					<image src="/static/taber/我的-选中.png"></image>
					<text>我的</text>
				</view>
				<view class="indicator">

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				active: 3,
			}
		},
		onLoad() {

		},
		methods: {
			activeBtn(e) {
				var _this = this;
				// _this.active = 3;
			},
		}
	}
</script>

<style>
	* {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	page {
		display: flex;
		justify-content: center;
		align-items: center;
		/* min-height: 170vh; */
		background: #e8e8e8;
	}

	.nav {
		margin-top: 1100rpx;
		position: relative;
		width: 400px;
		height: 70px;
		background: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		/* min-height: 170vh; */
	}

	.ul {
		display: flex;
		width: 350px;
	}

	.li {
		height: 70px;
		flex: 1;
		position: relative;
		list-style: none;
		z-index: 2;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.li::before {
		content: "";
		position: absolute;
		top: 10px;
		left: 0;
		width: 100%;
		height: 100%;
		background: orange;
		border-radius: 50%;
		filter: blur(5px);
		opacity: 0;
		transition: 0.5s;
		transition-delay: 0s;
	}

	.li image {
		width: 30px;
		height: 30px;
	}

	.li text {
		display: flex;
		align-items: center;
		height: 25px;
		font-size: 16px;
		font-weight: 300;
	}

	.active {
		border-radius: 50%;
		background: orange;
		transform: translateY(-27px);
		transition-delay: 0.25s;
	}

	.active::before {
		opacity: 0.5;
		transition-delay: 0.25s;
	}

	.indicator {
		position: absolute;
		top: -35px;
		margin-left: -5px;
		width: 80px;
		height: 80px;
		background: #fff;
		border-radius: 50%;
		z-index: 1;
		transition: 0.5s;
	}

	.indicator::before {
		content: "";
		position: absolute;
		top: 5px;
		left: -26px;
		width: 30px;
		height: 30px;
		background: transparent;
		border-radius: 50%;
		box-shadow: 15px 18px #fff;
	}

	.indicator::after {
		content: "";
		position: absolute;
		top: 5px;
		right: -26px;
		width: 30px;
		height: 30px;
		background: transparent;
		border-radius: 50%;
		box-shadow: -15px 18px #fff;

	}

	.li:nth-child(1).active~.indicator {
		transform: translateX(calc(70px*0));
	}

	.li:nth-child(2).active~.indicator {
		transform: translateX(calc(70px*1));
	}

	.li:nth-child(3).active~.indicator {
		transform: translateX(calc(70px*2));
	}

	.li:nth-child(4).active~.indicator {
		transform: translateX(calc(70px*3));
	}

	.li:nth-child(5).active~.indicator {
		transform: translateX(calc(70px*4));
	}
</style>