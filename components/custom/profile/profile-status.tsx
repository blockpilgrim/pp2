import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface ProfileStatusProps {
  isD365User?: boolean;
  states?: string[];
  roles?: string[];
  error?: string;
}

export function ProfileStatus({ isD365User, states, roles, error }: ProfileStatusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Account Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* D365 Connection Status */}
        <div className="flex items-center gap-2">
          {isD365User ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm">Connected to Dynamics 365</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-orange-700">
                No Dynamics 365 profile linked
              </span>
            </>
          )}
        </div>

        {/* Roles */}
        {roles && roles.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Roles</p>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <Badge key={role} variant="secondary">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* State Assignments */}
        {states && states.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">State Assignments</p>
            <div className="flex flex-wrap gap-2">
              {states.map((state) => (
                <Badge key={state} variant="outline">
                  {state.charAt(0).toUpperCase() + state.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Error Status */}
        {error && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Session error: {error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}