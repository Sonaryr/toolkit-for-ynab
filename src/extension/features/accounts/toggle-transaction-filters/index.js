import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Feature } from 'toolkit/extension/features/feature';
import { componentLookup, controllerLookup } from 'toolkit/extension/utils/ember';
import { addToolkitEmberHook } from 'toolkit/extension/utils/toolkit';
import { componentAppend } from 'toolkit/extension/utils/react';

const ToggleButton = ({ longTitle, stateField }) => {
  const accountsController = controllerLookup('accounts');
  const [isToggled, setIsToggled] = React.useState(accountsController.get(`filters.${stateField}`));

  const toggleSetting = () => {
    const current = accountsController.get(`filters.${stateField}`);
    accountsController.set(`filters.${stateField}`, !current);
    setIsToggled(!current);
  };

  return (
    <button className={`button ${!isToggled && 'button-disabled'}`} onClick={toggleSetting}>
      <i
        className={`flaticon solid ${
          stateField === 'reconciled' ? 'lock-1' : 'clock-1'
        } is-reconciled`}
      >
        {longTitle && (stateField === 'reconciled' ? ' Reconciled' : ' Scheduled')}
      </i>
    </button>
  );
};

ToggleButton.propTypes = {
  longTitle: PropTypes.bool.isRequired,
  stateField: PropTypes.string.isRequired,
};

export class ToggleTransactionFilters extends Feature {
  shouldInvoke() {
    return true;
  }

  invoke() {
    const accountHeaderProto = Object.getPrototypeOf(componentLookup('accounts/account-header'));

    addToolkitEmberHook(this, accountHeaderProto, 'didRender', this.injectButtons);
  }

  injectButtons = element => {
    const toolbarRight = $('.accounts-toolbar-right', element);
    if ($('#tk-toggle-transaction-filters', toolbarRight).length) {
      return;
    }

    componentAppend(
      <span id="tk-toggle-transaction-filters">
        <ToggleButton stateField={'reconciled'} longTitle={this.settings.enabled === '2'} />
        <ToggleButton stateField={'scheduled'} longTitle={this.settings.enabled === '2'} />
      </span>,
      toolbarRight
    );
  };
}
