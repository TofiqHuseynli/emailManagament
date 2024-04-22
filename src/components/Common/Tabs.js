import React from 'react';
import classNames from 'classnames';
import {Lang} from 'fogito-core-ui';

export const Tab = ({label, active, onClick}) => {
    return (
        <li className="nav-item test">
            <button
                className={classNames('nav-link', {
                    active,
                })}
                onClick={onClick}
            >
                {Lang.get(label)}
            </button>
        </li>
    );
};

export const Tabs = ({selectedTab, onChange, children = []}) => {
    const containerRef = React.useRef(null);
    const [containerWidth, setContainerWidth] = React.useState();

    React.useEffect(() => {
        setContainerWidth(containerRef.current.getBoundingClientRect()?.width);
    }, [containerRef]);

    const sliderWidth = containerWidth / children.length;

    const tabs = children.map((child) => {
        const handleClick = () => {
            onChange(child.props?.value);
        };

        return React.cloneElement(child, {
            key: child.props?.value,
            active: child.props?.value === selectedTab,
            onClick: handleClick,
        });
    });

    return (
        <div className="core-horizontal-navbar" ref={containerRef}>
            <ul>{tabs}</ul>
            <span className="border__bottom"/>
        </div>
    );
};

export const TabPanel = ({children, value, selectedIndex, mountHidden = true}) => {

    const hidden = value !== selectedIndex;

    if (hidden && !mountHidden) {
        return '';
    }

    return (
        <div
            className={`w-100 ${hidden && 'd-none'}`}
        >
            {children}
        </div>
    );

};
