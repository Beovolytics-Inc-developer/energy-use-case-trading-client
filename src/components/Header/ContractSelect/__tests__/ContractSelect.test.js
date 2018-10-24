import React from 'react';
import { shallow } from 'enzyme';
import ContractSelect from '../ContractSelect';

const contractsDummy = [{ id: '10020' }, { id: '10022' }, { id: '10032' }];
const contractIdDummy = '10020';
const onChangeStub = jest.fn();

function renderComponent(
    { contracts = contractsDummy, selectedContractId = contractIdDummy, onChange = onChangeStub, ...otherProps } = {},
    mountFn = shallow
) {
    return mountFn(
        <ContractSelect
            contracts={contracts}
            selectedContractId={selectedContractId}
            onChange={onChange}
            {...otherProps}
        />
    );
}

describe('<ContractSelect /> component', () => {
    afterEach(() => {
        onChangeStub.mockClear();
    });

    it('should renders without errors', () => {
        const select = renderComponent();
        expect(select.find('SelectField')).toHaveLength(1);
        expect(select.find('.contract-select')).toHaveLength(1);
        expect(select.find('.select-field--contract')).toHaveLength(1);
    });

    it('should calls onChange callback', () => {
        const select = renderComponent();

        select
            .find('SelectField')
            .props()
            .onChange({ value: '10022', name: '' });
        expect(onChangeStub).toHaveBeenCalledWith('10022');
    });

    it('should provide property to select field in original case', () => {
        const select = renderComponent({ selectedContractId: '10022' });
        expect(select.find('SelectField').props().value).toEqual('10022');
    });
});
