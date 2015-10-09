describe('Filters::', function() {
    beforeEach(function() {
        module('todoer');
    });

    describe('Chunk filter', function() {
        var chunkFilter;

        beforeEach(inject(function(_chunkFilter_) {
            chunkFilter = _chunkFilter_;

        }));

        it('should be defined', function() {
            expect(chunkFilter).toBeDefined();
        });

        it('should not generate chunk array without array length', function() {
            expect(chunkFilter()).not.toBeDefined();
        });

        it('should generate chunks array', function() {
            var arr = [0, 1, 2];
            expect(chunkFilter(3)).toEqual(arr);
            arr.push(3);
            arr.push(4);
            expect(chunkFilter(5)).toEqual(arr);
            arr.push(5);
            expect(chunkFilter(6)).toEqual(arr);
        });
    });
});