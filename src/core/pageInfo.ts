import { PageInfo } from './types';

export default function getPageInfo(): PageInfo{
    return {
        path: window.location.href || '',
        page_name: document.title || '',
        page_width: document.body.clientWidth,
        page_height: document.body.clientHeight
    };
}
