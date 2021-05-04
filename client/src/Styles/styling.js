
  import { withStyles } from '@material-ui/core/styles';

  import {Legend} from '@devexpress/dx-react-chart-material-ui';
  export const legendStyles = () => ({
      root: {
        display: 'flex',
        margin: 'auto',
        flexDirection: 'row',
      },
    });
  export const legendRootBase = ({ classes, ...restProps }) => (
    <Legend.Root {...restProps} className={classes.root} />
  );
  export const Root = withStyles(legendStyles, { name: 'LegendRoot' })(legendRootBase);
  export const legendLabelStyles = () => ({
    label: {
      whiteSpace: 'nowrap',
    },
  });
  export const legendLabelBase = ({ classes, ...restProps }) => (
    <Legend.Label className={classes.label} {...restProps} />
  );
  export const Label = withStyles(legendLabelStyles, { name: 'LegendLabel' })(legendLabelBase);

  