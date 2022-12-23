import router from "./router";


export default {
	async fetch(request, workerSecret, workerContext) {
		return router.handle(request, workerSecret, workerContext);
	}
};