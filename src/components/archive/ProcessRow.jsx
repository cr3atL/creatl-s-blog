import { Button } from 'antd';
import StatusTag from './StatusTag';

export default function ProcessRow({ title, description, status, buttonLabel = '打开', onOpen, path }) {
  return <article className="process-row" data-status={status}>
    <div className="process-row__body">
      <h3 className="process-row__title">{title}</h3>
      {description && <p className="process-row__description">{description}</p>}
    </div>
    <div className="process-row__action">
      <StatusTag status={status} />
      <Button onClick={() => onOpen?.(path)} className="process-row__button" aria-label={`${buttonLabel} ${title}`}>{buttonLabel}</Button>
    </div>
  </article>;
}
