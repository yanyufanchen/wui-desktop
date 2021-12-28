<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			this.routerGuard();
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			routerGuard(){
				let url = window.location.href;
				const user = uni.getStorageSync('user');
				if(user&&user.token){
					console.log('已登录')
					this.$store.commit('setUser', user);
					if(url.indexOf('login')){
						uni.redirectTo({
							url: "/pages/home/index"
						});
					}
				}else{
					uni.redirectTo({
						url: "/pages/home/login"
					});
				}
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
