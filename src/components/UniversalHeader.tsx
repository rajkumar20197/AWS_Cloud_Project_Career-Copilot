import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from './ui/dropdown-menu';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Home, 
  Building2, 
  Shield, 
  ExternalLink,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { DomainManager } from '../config/domains';

interface UniversalHeaderProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  onLogout?: () => void;
}

export const UniversalHeader: React.FC<UniversalHeaderProps> = ({ user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentConfig = DomainManager.getCurrentConfig();
  const navigationItems = DomainManager.getNavigationItems();
  const crossDomainLinks = DomainManager.getCrossDomainLinks();

  const getDomainIcon = (type: string) => {
    switch (type) {
      case 'consumer': return <Home className="h-4 w-4" />;
      case 'agency': return <Building2 className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      default: return <Home className="h-4 w-4" />;
    }
  };

  const getDomainBadgeVariant = (type: string) => {
    switch (type) {
      case 'consumer': return 'default';
      case 'agency': return 'secondary';
      case 'admin': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Domain Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img 
              src={currentConfig.theme.logo} 
              alt={currentConfig.name}
              className="h-8 w-8"
              onError={(e) => {
                e.currentTarget.src = '/logo-fallback.svg';
              }}
            />
            <span className="font-bold text-lg hidden sm:inline-block">
              AI Career Coach
            </span>
          </div>
          
          <Badge 
            variant={getDomainBadgeVariant(currentConfig.type)}
            className="flex items-center gap-1"
          >
            {getDomainIcon(currentConfig.type)}
            <span className="capitalize">{currentConfig.type}</span>
          </Badge>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* User Menu and Domain Switcher */}
        <div className="flex items-center gap-2">
          {/* Domain Switcher */}
          {crossDomainLinks.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  Switch Portal
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {crossDomainLinks.map((link) => (
                  <DropdownMenuItem key={link.url} asChild>
                    <a 
                      href={link.url}
                      className="flex items-center gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{link.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {link.description}
                        </div>
                      </div>
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-3 w-3" />
                    </div>
                  )}
                  <span className="hidden sm:inline-block">{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {user.role}
                  </Badge>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button size="sm">
                Get Started
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 space-y-2">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            
            {crossDomainLinks.length > 0 && (
              <>
                <div className="border-t pt-2 mt-2">
                  <p className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Other Portals
                  </p>
                  {crossDomainLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        {link.label}
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};