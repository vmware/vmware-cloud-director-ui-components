/*!
 * Copyright 2020 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { DebugElement, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AngularLocatorDriver, TestElement } from './angular-widget-object';
import { BaseWidgetObject, TaggedClass } from './widget-object';
import { CorrectReturnTypes } from './widget-object';

/**
 * Knows how to find Angular objects in the DOM.
 */

export class AngularWidgetObjectFinder<H = unknown> {
    /**
     * We don't care or could possibly know the type of fixture
     */
    private fixture: ComponentFixture<H>;

    /**
     * If you need direct access to manipulate the host
     */
    public hostComponent: H;

    /**
     * @param componentConstructor The host component to be created as the root of the tests's fixture
     */
    constructor(arg: Type<H> | ComponentFixture<H>) {
        this.fixture = (arg as ComponentFixture<H>).componentRef
            ? (arg as ComponentFixture<H>)
            : TestBed.createComponent(arg as Type<H>);
        this.hostComponent = this.fixture.componentInstance;
    }

    /**
     * Finds a single widget object
     *
     * @param widgetConstructor the constructor of the widget to use
     * @param ancestor the parent to begin the search from
     * @param cssSelector the cssSelector to post-pend to the tagName for the search
     *
     * @throws An error if the widget is not found or if there are multiple instances
     */
    public find<T extends TaggedClass & Type<BaseWidgetObject<TestElement>>, G>(
        widgetConstructor: T,
        ancestor?: DebugElement,
        cssSelector?: string
    ): CorrectReturnTypes<InstanceType<T>, TestElement> {
        let query = widgetConstructor.tagName;
        if (cssSelector) {
            query += `${cssSelector}`;
        }
        if (ancestor) {
            query = query;
        }

        const root = (ancestor ? ancestor : this.fixture.debugElement).query(By.css(query));
        if (!root) {
            throw new Error(`Could not find the widget using the query ${query}`);
        }

        const widget = new widgetConstructor(new AngularLocatorDriver(new TestElement([root], this.fixture), root));
        return (widget as any) as CorrectReturnTypes<InstanceType<T>, TestElement>;
    }

    /**
     * Runs a change detection cycle.
     */
    public detectChanges(): void {
        this.fixture.detectChanges();
    }
}
