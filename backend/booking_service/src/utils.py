import datetime


def floor_to_hour(dt: datetime.datetime) -> datetime.datetime:
    return dt.replace(minute=0, second=0, microsecond=0)


def ceil_to_hour(dt: datetime.datetime) -> datetime.datetime:
    if dt.minute == 0 and dt.second == 0 and dt.microsecond == 0:
        return dt
    return (dt + datetime.timedelta(hours=1)).replace(minute=0, second=0, microsecond=0)
