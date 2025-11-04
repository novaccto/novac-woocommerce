/**
 * External dependencies
 */
import * as React from 'react';

/**
 * Internal dependencies
 */
import './style.scss';
import ErrorBoundary from 'wcnovac/admin/components/error-boundary';

const Page = ( {
                   children,
                   maxWidth,
                   isNarrow,
                   className = '',
               } ) => {
    const customStyle = maxWidth ? { maxWidth } : undefined;
    const classNames = [ className, 'novac-page' ];
    if ( isNarrow ) {
        classNames.push( 'is-narrow' );
    }

    return (
        <div className={ classNames.join( ' ' ) } style={ customStyle }>
            <ErrorBoundary>{ children }</ErrorBoundary>
        </div>
    );
};

export default Page;