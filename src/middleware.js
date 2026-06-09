import { NextResponse } from 'next/server';

export async function middleware(request) {
    // 1. 先执行你图床原本的中间件逻辑（比如检查登录、鉴权等）
    // 注意：如果原代码里有特殊的处理逻辑，这段代码会自动承接
    let response = NextResponse.next();

    // 2. 核心杀招：强行给所有经过的请求（尤其是 /api/ 图片接口）焊上跨域通行证
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT, DELETE');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    // 3. 完美应对浏览器的 OPTIONS 预检请求（如果是预检，直接绿灯放行返回 204）
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS, POST, PUT, DELETE',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
            },
        });
    }

    return response;
}

// 确保中间件能够匹配到你图床的所有 API 路由和图片路径
export const config = {
    matcher: ['/api/:path*', '/rfile/:path*'],
};
