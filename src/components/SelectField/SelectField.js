import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import pick from 'lodash.pick';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/fontawesome-free-solid';
import './SelectField.css';

export const OptionPropType = PropTypes.shape({
    value: PropTypes.string,
    title: PropTypes.string
});

class SelectField extends Component {
    constructor(props) {
        super(props);

        const [firstOption] = props.options;

        this.handleBodyClick = this.handleBodyClick.bind(this);
        this.state = {
            selectedOption: props.defaultValue || firstOption,
            isFocused: false
        };
    }

    getState() {
        return { ...this.state, ...pick(this.props, ['value']) };
    }

    componentDidMount() {
        document.body.addEventListener('click', this.handleBodyClick);
    }

    componentWillUnmount() {
        document.body.removeEventListener('click', this.handleBodyClick);
    }

    handleBodyClick(event) {
        const { isFocused } = this.getState();

        this.setState({
            isFocused: isFocused
                ? false
                : !!(this.layoutRef.compareDocumentPosition(event.target) & Node.DOCUMENT_POSITION_CONTAINED_BY)
        });
    }

    handleOptionMouseDown(option) {
        const { onChange } = this.props;

        this.setState({ selectedOption: option, isFocused: false });
        if (typeof onChange === 'function') {
            onChange(option);
        }
    }

    renderOption(option) {
        const { selectedOption } = this.getState();
        const classes = classNames({
            'options-list-item': true,
            'options-list-item--selected': selectedOption.value === option.value
        });

        return (
            <li className={classes} key={option.value} onMouseDown={() => this.handleOptionMouseDown(option)}>
                {option.title}
            </li>
        );
    }

    render() {
        const { id, label, options } = this.props;
        const { selectedOption, isFocused } = this.getState();
        const listBoxId = `listbox-${id}`;
        const classes = classNames('select-field', isFocused && 'select-field--focused');

        return (
            <div id={id} className={classes}>
                <div className="select-field-layout" ref={ref => (this.layoutRef = ref)}>
                    <label className="select-field-label">{label}</label>
                    <div
                        className="select-field-input"
                        role="combobox"
                        aria-expanded={isFocused}
                        aria-controls={listBoxId}
                    >
                        <div role="button" className="select-control">
                            <strong className="select-control-text">{selectedOption && selectedOption.title}</strong>
                            <FontAwesomeIcon className="select-control-icon" icon={faChevronDown} />
                        </div>
                        {isFocused && (
                            <ul id={listBoxId} className="options-list" role="listbox">
                                {options.map(this.renderOption.bind(this))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

SelectField.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(OptionPropType),
    defaultValue: OptionPropType,
    value: OptionPropType,
    onChange: PropTypes.func
};
SelectField.defaultProps = {
    id: Date.now(),
    options: []
};

export default SelectField;
