<?php

namespace App\Http\Middleware;

use App\Models\Audit;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuditLogMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($this->shouldSkip($request)) {
            return $response;
        }

        try {
            $user = $request->user();
            $routeName = $request->route()?->getName();

            Audit::create([
                'user_id' => $user?->id,
                'username' => $user?->username,
                'role' => $user?->role,
                'action' => sprintf('%s %s', $request->method(), $routeName ?? $request->path()),
                'method' => $request->method(),
                'route_name' => $routeName,
                'url' => $request->fullUrl(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'status_code' => $response->getStatusCode(),
                'details' => $this->sanitizeDetails($request),
            ]);
        } catch (\Throwable $e) {
            // Never block app flow if audit logging fails.
        }

        return $response;
    }

    private function shouldSkip(Request $request): bool
    {
        if ($request->is('storage/*', 'build/*', 'hot', 'up')) {
            return true;
        }

        if (str_starts_with($request->path(), '_ignition')) {
            return true;
        }

        return false;
    }

    private function sanitizeDetails(Request $request): ?array
    {
        $payload = $request->except([
            'password',
            'password_confirmation',
            'current_password',
            'image',
            'clearance',
        ]);

        if (empty($payload)) {
            return null;
        }

        array_walk_recursive($payload, function (&$value): void {
            if (is_string($value) && strlen($value) > 500) {
                $value = substr($value, 0, 500) . '...';
            }
        });

        return $payload;
    }
}
