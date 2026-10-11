/// <reference lib="webworker" />

import { handle } from "@hono/service-worker"
import { app } from "./router";

declare const self:ServiceWorkerGlobalScope

self.addEventListener('install',event=>{
    event.waitUntil(caches.open('assets').then(cache=>{
        cache.addAll(['/styles.css','/js/index.js','/manifest.json'])
    }))
})

self.addEventListener('fetch',handle(app))