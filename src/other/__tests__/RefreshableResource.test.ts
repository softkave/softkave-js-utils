import {noop} from 'lodash-es';
import {describe, expect, test, vi} from 'vitest';
import {RefreshableResource} from '../RefreshableResource.js';
import {waitTimeout} from '../waitTimeout.js';

function getRefreshableResource(
  props: Partial<ConstructorParameters<typeof RefreshableResource>[0]> = {}
) {
  return new RefreshableResource({
    timeout: 50,
    resource: 1,
    refreshFn: async () => 2,
    onRefresh: noop,
    onError: noop,
    ...props,
  });
}

describe('RefreshableResource', () => {
  test('start', async () => {
    const refreshableResource = getRefreshableResource();

    refreshableResource.start();
    await waitTimeout(75);

    expect(refreshableResource.getValue()).toBe(2);
  });

  test('start, onRefresh', async () => {
    const onRefresh = vi.fn();
    const refreshableResource = getRefreshableResource({
      onRefresh,
    });

    refreshableResource.start();
    await waitTimeout(75);

    expect(onRefresh).toHaveBeenCalledTimes(1);
    expect(onRefresh).toHaveBeenCalledWith(2, 1);
  });

  test('start, onError', async () => {
    const onError = vi.fn();
    const refreshableResource = getRefreshableResource({
      refreshFn: async () => {
        throw new Error('error');
      },
      onError,
    });

    refreshableResource.start();
    await waitTimeout(75);

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(new Error('error'), 1);
  });

  test('stop', async () => {
    const refreshableResource = getRefreshableResource();

    refreshableResource.start().stop();
    await waitTimeout(75);

    expect(refreshableResource.getValue()).toBe(1);
  });

  test('getValue', () => {
    const refreshableResource = getRefreshableResource();

    expect(refreshableResource.getValue()).toBe(1);
  });

  test('setValue', () => {
    const refreshableResource = getRefreshableResource();

    refreshableResource.setValue(2);
    expect(refreshableResource.getValue()).toBe(2);
    expect(refreshableResource.getPreviousValue()).toBe(1);
  });

  test('getPreviousValue', async () => {
    const refreshableResource = getRefreshableResource();

    expect(refreshableResource.getPreviousValue()).toBe(null);

    refreshableResource.start();
    await waitTimeout(100);

    expect(refreshableResource.getPreviousValue()).toBe(1);
  });

  test('refresh', async () => {
    let i = 1;
    const refreshableResource = new RefreshableResource({
      timeout: 200,
      resource: i,
      refreshFn: async () => ++i,
      onRefresh: noop,
      onError: noop,
    });

    refreshableResource.start();
    await waitTimeout(100);

    await refreshableResource.refresh();
    expect(refreshableResource.getValue()).toBe(2);
    await waitTimeout(100);
    expect(refreshableResource.getValue()).toBe(2);
    await waitTimeout(100);

    expect(refreshableResource.getValue()).toBe(3);
  });

  test('getRefreshTimeout', async () => {
    const refreshableResource = getRefreshableResource({
      timeout: 200,
    });

    expect(refreshableResource.getRefreshTimeout()).toBe(200);
  });

  test('setRefreshTimeout', async () => {
    const refreshableResource = getRefreshableResource({timeout: 200});

    refreshableResource.setRefreshTimeout(100);
    expect(refreshableResource.getRefreshTimeout()).toBe(100);
  });

  test('getRefreshFn', async () => {
    const refreshFn = async () => 2;
    const refreshableResource = getRefreshableResource({refreshFn});

    expect(refreshableResource.getRefreshFn()).toBe(refreshFn);
  });

  test('setRefreshFn', async () => {
    const refreshFn = async () => 2;
    const refreshableResource = getRefreshableResource();

    refreshableResource.setRefreshFn(refreshFn);
    expect(refreshableResource.getRefreshFn()).toBe(refreshFn);
  });

  test('getOnRefresh', async () => {
    const onRefresh = noop;
    const refreshableResource = getRefreshableResource({onRefresh});

    expect(refreshableResource.getOnRefresh()).toBe(onRefresh);
  });

  test('setOnRefresh', async () => {
    const onRefresh = noop;
    const refreshableResource = getRefreshableResource();

    refreshableResource.setOnRefresh(onRefresh);
    expect(refreshableResource.getOnRefresh()).toBe(onRefresh);
  });

  test('getOnError', async () => {
    const onError = noop;
    const refreshableResource = getRefreshableResource({onError});

    expect(refreshableResource.getOnError()).toBe(onError);
  });

  test('setOnError', async () => {
    const onError = noop;
    const refreshableResource = getRefreshableResource();

    refreshableResource.setOnError(onError);
    expect(refreshableResource.getOnError()).toBe(onError);
  });

  test('dispose', async () => {
    const refreshableResource = getRefreshableResource({timeout: 200});

    refreshableResource.start();
    await waitTimeout(100);

    refreshableResource.dispose();
    await waitTimeout(200);

    expect(refreshableResource.getValue()).toBe(1);
  });
});
