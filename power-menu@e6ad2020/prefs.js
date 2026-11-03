/*
 * Power Menu for GNOME Shell
 *
 * Preferences window logic for configuring the power menu actions.
 *
 * License: MIT
 */

import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';
import GObject from 'gi://GObject';

import { ExtensionPreferences, gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

const ACTION_DEFINITIONS = {
    'poweroff': { name: 'Shutdown', icon: 'system-shutdown-symbolic' },
    'suspend': { name: 'Suspend', icon: 'weather-clear-night-symbolic' },
    'reboot': { name: 'Restart', icon: 'system-reboot-symbolic' },
    'logout': { name: 'Log Out', icon: 'system-log-out-symbolic' },
};

/**
 * Preferences window for the Power Menu extension
 */
export default class PowerMenuPreferences extends ExtensionPreferences {

    /**
     * Setup the preferences UI
     *
     * @param {Adw.PreferencesWindow} window - The preferences window provided by GNOME
     */
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        window.set_default_size(500, 500);

        const page = new Adw.PreferencesPage({
            title: _('Actions'),
            icon_name: 'system-shutdown-symbolic',
        });
        window.add(page);

        const group = new Adw.PreferencesGroup({
            title: _('Dialogue Actions'),
            description: _('Configure which actions appear in the shutdown dialogue and their order. Use the arrow buttons to reorder.'),
        });
        page.add(group);

        this._settings = settings;
        this._group = group;
        this._rows = [];
        this._toggles = new Map();

        this._buildRows();

        // Listen for external setting changes
        this._orderChangedId = settings.connect('changed::action-order', () => {
            this._buildRows();
        });
        this._visibilityChangedId = settings.connect('changed::action-visibility', () => {
            this._buildRows();
        });

        window.connect('close-request', () => {
            if (this._orderChangedId) {
                settings.disconnect(this._orderChangedId);
                this._orderChangedId = null;
            }
            if (this._visibilityChangedId) {
                settings.disconnect(this._visibilityChangedId);
                this._visibilityChangedId = null;
            }
        });
    }

    /**
     * Return recognized visible action IDs for the current configuration
     *
     * @param {string[]} [visibility] - Configured visible action IDs
     * @returns {string[]} Recognized visible action IDs
     */
    _getValidVisibleActions(visibility = this._settings.get_strv('action-visibility')) {
        const actionOrder = this._settings.get_strv('action-order');
        const orderedValidActions = actionOrder.filter(actionId => Boolean(ACTION_DEFINITIONS[actionId]));
        const validActions = orderedValidActions.length > 0
            ? [...new Set(orderedValidActions)]
            : Object.keys(ACTION_DEFINITIONS);

        return validActions.filter(actionId => visibility.includes(actionId));
    }

    /**
     * Synchronize switch sensitivity so the last visible action cannot be hidden
     *
     * @param {string[]} [visibility] - Configured visible action IDs
     */
    _updateToggleSensitivity(visibility = this._settings.get_strv('action-visibility')) {
        const validVisibleActions = this._getValidVisibleActions(visibility);
        const isLastVisibleAction = validVisibleActions.length <= 1;

        for (const [actionId, toggle] of this._toggles.entries()) {
            const isVisible = validVisibleActions.includes(actionId);
            toggle.set_sensitive(!isVisible || !isLastVisibleAction);
        }
    }

    /**
     * Build the list of actions in the preferences UI
     */
    _buildRows() {
        // Remove existing rows
        for (const row of this._rows) {
            this._group.remove(row);
        }
        this._rows = [];
        this._toggles = new Map();

        const actionOrder = this._settings.get_strv('action-order');
        const actionVisibility = this._settings.get_strv('action-visibility');
        const validVisibleActions = this._getValidVisibleActions(actionVisibility);

        for (let i = 0; i < actionOrder.length; i++) {
            const actionId = actionOrder[i];
            const def = ACTION_DEFINITIONS[actionId];
            if (!def) continue;

            const row = new Adw.ActionRow({
                title: _(def.name),
                icon_name: def.icon,
            });

            const isVisible = validVisibleActions.includes(actionId);

            // Visibility toggle
            const toggle = new Gtk.Switch({
                active: isVisible,
                sensitive: !isVisible || validVisibleActions.length > 1,
                valign: Gtk.Align.CENTER,
            });
            toggle.connect('notify::active', (sw) => {
                this._setActionVisibility(actionId, sw.get_active());
            });
            row.add_suffix(toggle);
            row.set_activatable_widget(toggle);
            this._toggles.set(actionId, toggle);

            // Move up button
            const upButton = new Gtk.Button({
                icon_name: 'go-up-symbolic',
                valign: Gtk.Align.CENTER,
                css_classes: ['flat'],
                sensitive: i > 0,
                tooltip_text: _('Move up'),
            });
            upButton.connect('clicked', () => {
                this._moveAction(actionId, -1);
            });

            // Move down button
            const downButton = new Gtk.Button({
                icon_name: 'go-down-symbolic',
                valign: Gtk.Align.CENTER,
                css_classes: ['flat'],
                sensitive: i < actionOrder.length - 1,
                tooltip_text: _('Move down'),
            });
            downButton.connect('clicked', () => {
                this._moveAction(actionId, 1);
            });

            // Create a box for the reorder buttons
            const buttonBox = new Gtk.Box({
                orientation: Gtk.Orientation.HORIZONTAL,
                spacing: 4,
                valign: Gtk.Align.CENTER,
                margin_start: 8,
            });
            buttonBox.append(upButton);
            buttonBox.append(downButton);
            row.add_suffix(buttonBox);

            this._group.add(row);
            this._rows.push(row);
        }
    }

    /**
     * Reorder an action
     *
     * @param {string} actionId - Action to move
     * @param {number} direction - -1 for up, 1 for down
     */
    _moveAction(actionId, direction) {
        const order = this._settings.get_strv('action-order');
        const index = order.indexOf(actionId);
        if (index < 0) return;

        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= order.length) return;

        // Swap elements
        [order[index], order[newIndex]] = [order[newIndex], order[index]];

        // Block signals to avoid recursive UI rebuilds
        if (this._orderChangedId) {
            this._settings.block_signal_handler(this._orderChangedId);
        }
        this._settings.set_strv('action-order', order);
        if (this._orderChangedId) {
            this._settings.unblock_signal_handler(this._orderChangedId);
        }

        this._buildRows();
    }

    /**
     * Toggle visibility of an action
     *
     * @param {string} actionId - Target action
     * @param {boolean} visible - Visibility state
     */
    _setActionVisibility(actionId, visible) {
        if (!ACTION_DEFINITIONS[actionId]) return;

        const visibility = this._settings.get_strv('action-visibility');
        const index = visibility.indexOf(actionId);

        if (!visible) {
            const remainingValidActions = this._getValidVisibleActions(visibility)
                .filter(id => id !== actionId);

            if (remainingValidActions.length === 0) {
                const toggle = this._toggles.get(actionId);
                if (toggle && !toggle.get_active()) {
                    toggle.set_active(true);
                }
                this._updateToggleSensitivity(visibility);
                return;
            }
        }

        if (visible && index < 0) {
            visibility.push(actionId);
        } else if (!visible && index >= 0) {
            for (let i = visibility.length - 1; i >= 0; i--) {
                if (visibility[i] === actionId) {
                    visibility.splice(i, 1);
                }
            }
        }

        // Block signals to avoid recursive UI rebuilds
        if (this._visibilityChangedId) {
            this._settings.block_signal_handler(this._visibilityChangedId);
        }
        this._settings.set_strv('action-visibility', visibility);
        if (this._visibilityChangedId) {
            this._settings.unblock_signal_handler(this._visibilityChangedId);
        }

        this._updateToggleSensitivity(visibility);
    }
}
