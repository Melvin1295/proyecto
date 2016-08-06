<?php

namespace Salesfly\Http\Middleware;

use Closure;

class RoleMiddleware
{
    protected $roles;

    public function __construct($roles){
        $this->$roles = $roles;
    }
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $role)
    {
        print_r($this->roles); die();
        //$roles = $this->getRequiredRoleForRoute($request->route());

        // Check if a role is required for the route, and
        // if so, ensure that the user has that role.
        //if($request->user()->hasRole($roles) || !$roles)
        if($role = 'admin')
        {
            return $next($request);
        }
        return response([
            'error' => [
                'code' => 'INSUFFICIENT_ROLE',
                'description' => 'You are not authorized to access this resource.'
            ]
        ], 401);
    }
}
