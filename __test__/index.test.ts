import Index from '../src/index';

describe('index', () => {
    const index = new Index();
    it('should be return a number', () => {
        expect(index.test(1)).toEqual(1);
    });
});