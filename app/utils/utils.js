import moment from 'moment';
import md5 from 'react-native-md5';
import querystring from 'querystring';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
  return true;
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    // eslint-disable-next-line no-restricted-properties
    s += (digit[Math.floor(num * 10 * Math.pow(10, index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

/**
 * 将object转换为x-www-form-urlencoded
 * @param data
 * @returns string x-www-form-urlencoded 字符串
 */
export function formData(data) {
  if (!data) {
    return '';
  }
  if (typeof data === 'string') {
    return data;
  }
  const s = [];
  Object.keys(data).forEach(key => {
    if (key && data[key]) {
      pushFormData(s, key, data[key], '');
    }
  });
  return s.join('&');
}

function pushFormData(array, key, data, parentKey) {
  if (!data) {
    return;
  }
  if (Array.isArray(data)) {
    data.forEach(value => {
      pushFormData(array, key, value, parentKey);
    });
    return;
  }
  if (typeof data === 'object') {
    Object.keys(data).forEach(child => {
      if (child && data[child]) {
        pushFormData(array, child, data[child], parentKey ? `${parentKey}.${key}` : key);
      }
    });
    return;
  }
  array.push(
    `${encodeURIComponent(parentKey ? `${parentKey}.${key}` : key)}=${encodeURIComponent(data)}`
  );
}

/**
 * 将spring data 的分页转换为ant design 的分页对象
 * @param page spring data 的分页对象
 * @returns ant design 的分页对象
 */
export function antPage(page = {}) {
  return {
    total: page.totalElements || 0,
    current: (page.number || 0) + 1,
    pageSize: page.size || 20,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showQuickJumper: false,
    showTotal: total => `共 ${total} 条`,
    simple: false,
  };
}

export function fromAntTable(pagination, filters, sorter = {}) {
  return {
    size: pagination.pageSize,
    page: pagination.current - 1,
    sort:
      !!sorter.field && !!sorter.order
        ? `${sorter.field},${sorter.order === 'descend' ? 'desc' : 'asc'}`
        : '',
  };
}

export function antSortOrder(page = {}, field) {
  if (Array.isArray(page.sort) && page.sort.length > 0 && page.sort[0].property === field) {
    return page.sort[0].ascending ? 'ascend' : 'descend';
  }
  return false;
}

export function antSorter(page = {}) {
  if (Array.isArray(page.sort) && page.sort.length > 0 && !!page.sort[0].property) {
    return {
      field: page.sort[0].property,
      order: page.sort[0].ascending ? 'ascend' : 'descend',
    };
  }
  return {};
}

/**
 * 将url中的query参数增加分页参数后，生成新的query string
 * @param search
 * @param pagination
 * @param filters
 * @param sorter
 * @returns {string}
 */
export function searchPagerString(search, pagination, filters, sorter = {}) {
  const pager = fromAntTable(pagination, filters, sorter);
  const query = querystring.parse(search.replace(/^[?]*(.*)$/, '$1'));
  return `?${formData({ ...query, ...pager })}`;
}

/**
 * 将url中的query参数增加分页外的其它参数，生成新的query string
 * @param search
 * @param param
 * @returns {*}
 */
export function searchString(search, param) {
  if (param) {
    const query = querystring.parse(search.replace(/^[?]*(.*)$/, '$1'));
    return `?${formData({ ...query, ...param })}`;
  }
  return search;
}

/**
 * 将url中的query参数增加分页外的其它参数，返回相关的对象
 * @param search
 * @param param
 * @returns {*}
 */
export function searchPayload(search, param) {
  const query = querystring.parse(search.replace(/^[?]*(.*)$/, '$1'));
  if (param) {
    return { ...query, ...param };
  }
  return query;
}

/**
 * 将值转为名称
 * @param labels
 * @param value
 * @returns {boolean|string}
 */
export function getLabel(labels, value) {
  const list = labels.filter(it => it.value === value);
  return (list && list.length > 0 && list[0].label) || '';
}

/*
     * Encode a string as utf-8.
     * For efficiency, this assumes the input is valid utf-16.
     */
export function utf8Str(input) {
  let output = '';
  let i = -1;
  let x;
  let y;

  // eslint-disable-next-line no-plusplus
  while (++i < input.length) {
    /* Decode utf-16 surrogate pairs */
    x = input.charCodeAt(i);
    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
    if (x >= 0xd800 && x <= 0xdbff && y >= 0xdc00 && y <= 0xdfff) {
      x = 0x10000 + ((x & 0x03ff) << 10) + (y & 0x03ff);
      // eslint-disable-next-line no-plusplus
      i++;
    }

    /* Encode output as utf-8 */
    if (x <= 0x7f) output += String.fromCharCode(x);
    else if (x <= 0x7ff)
      output += String.fromCharCode(0xc0 | ((x >>> 6) & 0x1f), 0x80 | (x & 0x3f));
    else if (x <= 0xffff)
      output += String.fromCharCode(
        0xe0 | ((x >>> 12) & 0x0f),
        0x80 | ((x >>> 6) & 0x3f),
        0x80 | (x & 0x3f)
      );
    else if (x <= 0x1fffff)
      output += String.fromCharCode(
        0xf0 | ((x >>> 18) & 0x07),
        0x80 | ((x >>> 12) & 0x3f),
        0x80 | ((x >>> 6) & 0x3f),
        0x80 | (x & 0x3f)
      );
  }
  return output;
}

export function md5Utf8(str) {
  return md5.hex_md5(utf8Str(str));
}
