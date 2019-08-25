/* eslint-disable no-unused-vars */
/* global UIkit */
import React from 'react';
import ReactDOM from 'react-dom';
import wfe from './wfe_obj';
import updateWatchface from './watchface_react';

function editor(name, action) {
    switch (action.type) {
    case 'set': {
        wfe.data[name] = action.value;
        break;
    }
    default: {
        return wfe.data[name];
    }
    }
    
}

class Checkbox extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {value: editor(this.props.value, {type: 'get'})};
    }

    onChange(e) {
        this.setState({value: e.target.checked});
        editor(this.props.value, {type: 'set', value: e.target.checked});
        updateWatchface();
    }

    render() {
        return (
            <label><input className="uk-checkbox" onChange={this.onChange} type="checkbox" checked={this.state.value}/> <span data-translate-id={this.props.translate}>{this.props.name}</span></label>
        );
    }
}

class NumberImput extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {value: editor(this.props.value, {type: 'get'})};
    }

    onChange(e) {
        if (e.target.value > this.props.max)
            e.target.value = this.props.max;
        if (e.target.value < this.props.min)
            e.target.value = this.props.min;
        this.setState({value: e.target.value});
        editor(this.props.value, {type: 'set', value: Number(e.target.value)});
        updateWatchface();
    }

    render() {
        return (
            <FormAppearance name={this.props.name} translate={this.props.translate}>
                <input className="uk-input" type="number" placeholder={this.props.name} min={this.props.min} max={this.props.max} value={this.state.value} onChange={this.onChange}/>
            </FormAppearance>
        );
    }
}

class Distance extends NumberImput {
    onChange(e) {
        if (e.target.value > this.props.max)
            e.target.value = this.props.max;
        if (e.target.value < this.props.min)
            e.target.value = this.props.min;
        this.setState({value: e.target.value});
        let dist = e.target.value.split(".");
        editor(this.props.value, {type: 'set', value: [
            Number(dist[0]),
            dist.length > 1 ? dist[1].slice(0, 2) : "00"
        ]});
        updateWatchface();
    }
}

class FormAppearance extends React.Component {
    render() {
        let classes = this.props.classes || " ";
        return (
            <div className="uk-width-1-4@s">
                <label className="uk-form-label" data-translate-id={this.props.translate}>{this.props.name}</label>
                <div className={"uk-form-controls " + classes}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

class Date extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {value: editor(this.props.value, {type: 'get'})};
    }

    onChange(e) {
        let t = e.target.valueAsDate || new Date(e.target.value),
            date = null;
        try {
            date = {
                day: t.getUTCDate(),
                month: t.getUTCMonth() + 1,
                weekDay: t.getUTCDay() > 0 ? t.getUTCDay() - 1 : 6
            };
        } catch (error) {
            e.target.value = "2017-12-06";
        }
        this.setState({value: e.target.value});
        editor(this.props.value, {type: 'set', value: date});
        updateWatchface();
    }

    render() {
        return (
            <FormAppearance name={this.props.name} translate={this.props.translate}>
                <input className="uk-input" type="date" defaultValue="2017-12-06" onChange={this.onChange}/>
            </FormAppearance>
        );
    }
}

class Time extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {value: editor(this.props.value, {type: 'get'})};
    }

    onChange(e) {
        let t = e.target.value.split(':'),
            time = {
                hours: t[0].toString(),
                minutes: t[1].toString()
            };
        this.setState({value: e.target.value});
        editor(this.props.value, {type: 'set', value: time});
        updateWatchface();
    }

    render() {
        return (
            <FormAppearance name="Time" translate="time">
                <input className="uk-input" type="time" defaultValue="20:38" onChange={this.onChange}/>
            </FormAppearance>
        );
    }
}

class Form extends React.Component {
    render() {
        return (
            <>
                <Date name="Date" translate="date" value="date"/>
                <Time name="Time" translate="time" value="time"/>
                <NumberImput value="battery" name="Battery" translate="battery" max={100} min={0} />
                <NumberImput value="calories" name="Calories" translate="calories" max={9999} min={0} />
                <Distance value="distance" name="Distance" translate="distance" max={99999} min={0} />
                <NumberImput value="pulse" name="Pulse" translate="pulse" max={9999} min={0} />
                <NumberImput value="steps" name="Steps" translate="steps" max={99999} min={0} />
                <NumberImput value="stepsGoal" name="Steps goal" translate="stepsgoal" max={99999} min={0} />
                <NumberImput value="seconds" name="Seconds" translate="seconds" max={59} min={0} />
                <NumberImput value="weatherDay" name="Weather day" translate="weatherD" max={99} min={-99} />
                <NumberImput value="weatherNight" name="Weather night" translate="weatherN" max={99} min={-99} />
                <NumberImput value="weathericon" name="Weather icon number" translate="weatherIconNumber" max={26} min={1} />
                <FormAppearance name="Status" translate="status" classes="uk-child-width-auto uk-grid">
                    <Checkbox value="bluetooth" name="Bluetooth" translate="bluetooth"/>
                    <Checkbox value="alarm" name="Alarm" translate="alarm"/>
                    <Checkbox value="dnd" name="Do not disturb" translate="dnd"/>
                    <Checkbox value="lock" name="Lock" translate="lock"/>
                </FormAppearance>
                <NumberImput value="animation" name="Animation image" translate="animation" max={10} min={1} />
                <NumberImput value="air" name="Air" translate="airQualityLabel" max={9999} min={0} />
                <FormAppearance name="Alt weather" translate="weatherAlt-label" classes="uk-child-width-auto uk-grid">
                    <Checkbox value="weatherAlt" name="Show alt weather" translate="weatherAlt"/>
                    <small data-translate-id="weatherAltDescription">Appears when current weather is unavailable</small>
                </FormAppearance>
            </>
        );
    }
}

export default () => ReactDOM.render(
    <Form/>,
    document.getElementById('form-react')
);