import { useHttp } from '../../hooks/http.hook';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { heroDeleted, fetchHeroes, filteredHeroesSelector } from './heroesSlice';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroesList.scss';

const HeroesList = () => {
	const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus),
		filteredHeroes = useSelector(filteredHeroesSelector),
		dispatch = useDispatch(),
		{ request } = useHttp();

	useEffect(() => {
		dispatch(fetchHeroes());

		// eslint-disable-next-line
	}, []);

	const deleteHero = useCallback((id, target) => {
		target.style.opacity = 0;

		setTimeout(() => {
			request(`http://localhost:3001/heroes/${id}`, 'DELETE')
				.then(dispatch(heroDeleted(id)))
				.catch(err => console.log('Something went wrong...', err));
		}, 300)

		// eslint-disable-next-line
	}, [request]);

	if (heroesLoadingStatus === "loading") {
		return <Spinner />;
	} else if (heroesLoadingStatus === "error") {
		return <h5 className="text-center mt-5">Ошибка при загрузки</h5>;
	}

	const renderHeroesList = (arr) => {
		if (arr.length === 0) {
			return <h5 className="text-center mt-5">Герои не обнаружены</h5>;
		}

		return arr.map(({ id, ...props }) => {
			return <HeroesListItem key={id} {...props} onDeleteHero={(e) => deleteHero(id, e.target.closest('li'))} />
		});
	};

	const elements = renderHeroesList(filteredHeroes);

	return (
		<ul>
			{elements}
		</ul>
	);
};

export default HeroesList;