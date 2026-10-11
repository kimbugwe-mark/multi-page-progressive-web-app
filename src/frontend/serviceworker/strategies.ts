export async function networkCache(request:Request,cacheName:string='assets'):Promise<Response> {
    let cache=await caches.open(cacheName),
    response=await cache.match(request)
    if (response!=undefined) {
        return response
    }
    response=await fetch(request)
    if (response.status==200) {
        cache.put(request,response.clone())
    }
    return response
}