import React from 'react';
import { serifTheme } from '../../../design-system/themes';

/**
 * Enhanced Stats Card Component
 * Displays statistical information with an icon and optional footer
 */
const StatsCard = ({ title, value, icon, bgColor, textColor, footerText, footerIcon }) => {
    const IconComponent = icon;
    const FooterIcon = footerIcon;
    
    return (
        <div 
            className={`${serifTheme.colors.background.card} ${serifTheme.radius.card} ${serifTheme.spacing.cardPadding} ${serifTheme.colors.border.primary} border ${serifTheme.colors.shadow.cardHover} relative ${serifTheme.transitions.default}`} 
            style={{ fontFamily: serifTheme.fontFamily.serif }}
        >
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                        <p className={`text-sm font-medium ${serifTheme.colors.text.secondary} mb-2`}>{title}</p>
                        <p className={`text-3xl font-bold ${serifTheme.colors.text.primary}`}>{value}</p>
                    </div>
                    <div className={`p-3 ${serifTheme.radius.button} ${serifTheme.colors.accent.primary} text-white shadow-lg`}>
                        <IconComponent className="w-6 h-6" />
                    </div>
                </div>
                {footerText && (
                    <div className={`flex items-center text-sm ${serifTheme.colors.text.tertiary} ${serifTheme.colors.background.secondary} px-3 py-2 ${serifTheme.radius.input}`}>
                        {FooterIcon && <FooterIcon className={`mr-2 w-4 h-4 ${serifTheme.colors.text.accent}`} />}
                        <span>{footerText}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard;

