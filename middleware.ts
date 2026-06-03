import { NextRequest, NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Can dang nhap de vao trang quan tri.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin", charset="UTF-8"',
      "Cache-Control": "no-store"
    }
  });
}

export function middleware(request: NextRequest) {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    return new NextResponse("Chua cau hinh ADMIN_USERNAME/ADMIN_PASSWORD.", {
      status: 500
    });
  }

  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Basic ")) {
    return unauthorized();
  }

  try {
    const encodedCredentials = authorization.slice("Basic ".length);
    const decodedCredentials = atob(encodedCredentials);
    const separatorIndex = decodedCredentials.indexOf(":");

    if (separatorIndex === -1) {
      return unauthorized();
    }

    const username = decodedCredentials.slice(0, separatorIndex);
    const password = decodedCredentials.slice(separatorIndex + 1);

    if (username === adminUsername && password === adminPassword) {
      return NextResponse.next();
    }
  } catch {
    return unauthorized();
  }

  return unauthorized();
}

export const config = {
  matcher: ["/admin/:path*"]
};
